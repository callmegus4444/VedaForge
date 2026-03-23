import os
import time
import traceback
from flask import Flask, request, jsonify
import pypdf

app = Flask(__name__)

def extract_text_from_pdf(file_path):
    reader = pypdf.PdfReader(file_path)
    total_pages = len(reader.pages)
    print(f"[RAG] PDF has {total_pages} pages")
    
    pages = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
            cleaned = text.strip()
            if len(cleaned) > 20:
                pages.append(cleaned)
                print(f"[RAG] Page {i+1}/{total_pages}: {len(cleaned)} chars")
            else:
                print(f"[RAG] Page {i+1}/{total_pages}: SKIPPED (empty or image)")
        except Exception as e:
            print(f"[RAG] Page {i+1} extraction error: {e}")
    
    return pages

def chunk_text(pages, chunk_size=600, overlap=80):
    full_text = "\n\n".join(pages)
    words = full_text.split()
    total_words = len(words)
    print(f"[RAG] Total words to chunk: {total_words}")
    
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk = " ".join(chunk_words)
        if len(chunk.strip()) > 50:
            chunks.append(chunk)
        i += chunk_size - overlap
    
    print(f"[RAG] Created {len(chunks)} chunks")
    return chunks, full_text

def select_context(chunks, max_chars=20000):
    # Groq llama-3.3-70b = 128k tokens context
    # 20000 chars = ~5000 tokens — safe for generation
    # Keeping it small so Groq responds FAST (avoid timeout)
    selected = []
    total = 0
    for chunk in chunks:
        if total + len(chunk) > max_chars:
            break
        selected.append(chunk)
        total += len(chunk)
    
    print(f"[RAG] Context: {len(selected)}/{len(chunks)} chunks, {total} chars")
    return selected

@app.route('/health', methods=['GET'])
def health():
    try:
        import pypdf
        pypdf_ok = True
    except:
        pypdf_ok = False
    return jsonify({ 
        'status': 'ok',
        'service': 'VedaForge RAG v2',
        'pypdf': pypdf_ok
    })

@app.route('/extract', methods=['POST'])
def extract():
    start_time = time.time()
    
    file = request.files.get("file")
    if not file:
        return jsonify({ 'success': False, 'error': 'No file uploaded' }), 400

    # Save temporarily
    file_path = f"/tmp/{file.filename}"
    file.save(file_path)
    
    print(f"\n[RAG] ===== NEW REQUEST =====")
    print(f"[RAG] File path: {file_path}")

    if not os.path.exists(file_path):
        print(f"[RAG] ERROR: File does not exist at: {file_path}")
        # List uploads dir to help debug
        uploads_dir = os.path.dirname(file_path)
        if os.path.exists(uploads_dir):
            files = os.listdir(uploads_dir)
            print(f"[RAG] Files in uploads dir: {files}")
            return jsonify({ 
                'success': False, 
                'error': f'File not found: {file_path}',
                'filesInDir': files
            }), 400
        return jsonify({ 
            'success': False, 
            'error': f'File not found: {file_path}' 
        }), 400

    file_size = os.path.getsize(file_path)
    print(f"[RAG] File size: {file_size} bytes")

    try:
        # STEP 1: Extract
        print(f"[RAG] Step 1: Extracting text...")
        pages = extract_text_from_pdf(file_path)
        
        if not pages:
            return jsonify({
                'success': False,
                'error': 'No text extracted. PDF is likely scanned/image-based.'
            }), 400

        # STEP 2: Chunk
        print(f"[RAG] Step 2: Chunking {len(pages)} pages...")
        chunks, full_text = chunk_text(pages, chunk_size=600, overlap=80)

        # STEP 3: Select context
        print(f"[RAG] Step 3: Selecting context window...")
        top_chunks = select_context(chunks, max_chars=20000)
        context = "\n\n---\n\n".join(top_chunks)

        elapsed = round(time.time() - start_time, 2)
        print(f"[RAG] ===== DONE in {elapsed}s =====")
        print(f"[RAG] Full text: {len(full_text)} chars")
        print(f"[RAG] Context: {len(context)} chars")
        print(f"[RAG] Preview: {full_text[:400]}")

        return jsonify({
            'success': True,
            'fullText': full_text,
            'context': context,
            'stats': {
                'pages': len(pages),
                'totalChunks': len(chunks),
                'selectedChunks': len(top_chunks),
                'fullTextChars': len(full_text),
                'contextChars': len(context),
                'elapsedSeconds': elapsed
            },
            'preview': full_text[:500]
        })

    except Exception as e:
        print(f"[RAG] FATAL ERROR: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'trace': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("VedaForge RAG Service v2")
    print("Port: 5001")
    print("pypdf only — no docling")
    print("=" * 50)
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
