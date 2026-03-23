"use client";

import { useRef, useState } from "react";
import { X, FileText } from "lucide-react";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function FileUpload({ value, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f: File) => {
    const validTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!validTypes.includes(f.type)) return;
    if (f.size > 10 * 1024 * 1024) return; // 10 MB (matches Figma: "up to 10MB")
    onChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {value ? (
        /* ── Uploaded state ── */
        <div
          style={{
            border: "1px solid #E5E5E5",
            borderRadius: "10px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#FFF7ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={18} color="#F97316" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#111111",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                margin: 0,
              }}
            >
              {value.name}
            </p>
            <p style={{ fontSize: "11px", color: "#999999", marginTop: "2px", margin: "2px 0 0 0" }}>
              {(value.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove file"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              color: "#999999",
              display: "flex",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FEE2E2")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
          >
            <X size={16} color="#DC2626" />
          </button>
        </div>
      ) : (
        /* ── Drop zone (exactly matches Figma: upload icon + text + Browse Files) ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#111111" : "#D1D5DB"}`,
            borderRadius: "12px",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: dragging ? "#F5F5F5" : "#FAFAFA",
            transition: "border-color 0.2s, background 0.2s",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {/* Upload cloud icon */}
          <div style={{ marginBottom: "4px", color: "#6B7280" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>

          <p style={{ fontSize: "13px", fontWeight: 500, color: "#444444", margin: 0 }}>
            Choose a file or drag &amp; drop it here
          </p>
          <p style={{ fontSize: "11px", color: "#999999", margin: 0 }}>JPEG, PNG, upto 10MB</p>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            style={{
              marginTop: "8px",
              padding: "7px 20px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#444444",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#111111";
              (e.currentTarget as HTMLButtonElement).style.background = "#F5F5F5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1D5DB";
              (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
            }}
          >
            Browse Files
          </button>

          <p style={{ fontSize: "11px", color: "#999999", margin: "4px 0 0 0" }}>
            Upload images of your preferred document/image
          </p>
        </div>
      )}
    </div>
  );
}
