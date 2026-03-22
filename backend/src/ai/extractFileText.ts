import path from 'path'
import fs from 'fs'
import axios from 'axios'

const RAG_URL = 'http://127.0.0.1:5001'

export async function extractFileText(fileUrl: string): Promise<string> {
  console.log('[EXTRACT] ===== START =====')
  console.log('[EXTRACT] fileUrl received:', fileUrl)
  
  // Extract just the filename from the URL
  const fileName = path.basename(fileUrl)
  console.log('[EXTRACT] fileName:', fileName)
  
  // Build absolute path — backend runs from vedaforge/backend/
  const absolutePath = path.join(process.cwd(), 'uploads', fileName)
  const cleanPath = absolutePath.split('\\').join('/')
  
  console.log('[EXTRACT] process.cwd():', process.cwd())
  console.log('[EXTRACT] absolutePath:', cleanPath)
  console.log('[EXTRACT] file exists:', fs.existsSync(absolutePath))
  
  if (!fs.existsSync(absolutePath)) {
    // Try to list uploads dir
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const exists = fs.existsSync(uploadsDir)
    console.log('[EXTRACT] uploads dir exists:', exists)
    if (exists) {
      const files = fs.readdirSync(uploadsDir)
      console.log('[EXTRACT] files in uploads:', files)
    }
    throw new Error(`File not found: ${cleanPath}`)
  }

  // Check RAG service health first
  try {
    const health = await axios.get(`${RAG_URL}/health`, { timeout: 5000 })
    console.log('[EXTRACT] RAG health:', health.data)
  } catch (e: any) {
    throw new Error(`RAG service not reachable on port 5001. Start it with: python app.py. Error: ${e.message}`)
  }

  console.log('[EXTRACT] Calling RAG service...')
  
  const response = await axios.post(
    `${RAG_URL}/extract`,
    { filePath: cleanPath },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000
    }
  )

  if (!response.data.success) {
    console.error('[EXTRACT] RAG returned error:', response.data.error)
    throw new Error(`RAG extraction failed: ${response.data.error}`)
  }

  const { context, stats, preview } = response.data
  console.log('[EXTRACT] ===== SUCCESS =====')
  console.log('[EXTRACT] Stats:', JSON.stringify(stats))
  console.log('[EXTRACT] Preview:', preview)
  
  return context  // Return chunked context, not full text
}
