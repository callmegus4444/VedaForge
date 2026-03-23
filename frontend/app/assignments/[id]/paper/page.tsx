"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, RefreshCw, Printer } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://vedaforge-backend.onrender.com";

interface Question {
  number: number;
  text: string;
  options?: string[] | null;
  correctOption?: string | null;
  modelAnswer?: string | null;
  difficulty: string;
  marks: number;
}

interface Section {
  title: string;
  type: string;
  instruction: string;
  questions: Question[];
}

interface PaperMeta {
  schoolName: string;
  subject: string;
  class: string;
  timeAllowed: string;
  totalMarks: number;
  instructions: string[];
}

interface AnswerEntry {
  questionNumber: number;
  answer: string;
}

interface Paper {
  paperMeta: PaperMeta;
  sections: Section[];
  answerKey: AnswerEntry[];
}

interface Assignment {
  _id: string;
  title: string;
  status: string;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export default function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPaper();
  }, [id]);

  async function fetchPaper() {
    try {
      const res = await fetch(`${API}/api/assignments/${id}`);
      if (!res.ok) throw new Error("Failed to load assignment");
      const data = await res.json();
      setAssignment(data.assignment);
      setPaper(data.paper);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`${API}/api/assignments/${id}/pdf`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assignment-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #EEE",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !paper || !assignment) {
    return (
      <div style={{ padding: "60px 36px", textAlign: "center" }}>
        <p style={{ color: "#DC2626", fontSize: "15px" }}>
          ⚠️ {error ?? "Paper not found"}
        </p>
        <button
          onClick={() => router.push("/assignments")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Assignments
        </button>
      </div>
    );
  }

  const meta = paper.paperMeta ?? {};

  return (
    <div className="mobile-container" style={{ maxWidth: "920px", margin: "0 auto", padding: "28px 24px 60px" }}>
      {/* ── Action bar ─────────────────────────────────────────── */}
      <div
        className="mobile-actions"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <button
          onClick={() => router.push("/assignments")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="mobile-stack-btns flex" style={{ gap: "10px" }}>
          <button
            className="hidden md:flex"
            onClick={() => router.push(`/assignments/${id}/generating`)}
            style={{
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              border: "1px solid var(--border)",
              background: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw size={15} />
            Regenerate
          </button>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              border: "1px solid var(--border)",
              background: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            <Printer size={15} />
            Print
          </button>
        </div>
      </div>

      {/* ── Context Header & Download ──────────────────────────── */}
      <div
        className="mobile-top-stmt mobile-header"
        style={{
          background: "#222222",
          color: "#FFFFFF",
          borderRadius: "16px",
          padding: "24px 32px",
          marginBottom: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, fontWeight: 600 }}>
          Certainly! Here is a customized Question Paper for your {meta.class ? `${meta.class} ` : ""}{meta.subject ?? "classes"} based on the uploaded content:
        </p>

        <div className="mobile-download-btn-wrapper">
           <button
             className="responsive-download-btn"
             onClick={handleDownload}
             disabled={downloading}
             style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               gap: "8px",
               padding: "12px 24px",
               background: "#FFFFFF",
               color: "#111827",
               border: "none",
               borderRadius: "9999px",
               cursor: downloading ? "not-allowed" : "pointer",
               fontSize: "15px",
               fontWeight: 600,
               opacity: downloading ? 0.75 : 1,
               transition: "transform 0.1s",
             }}
           >
             <Download size={16} />
             <span className="hidden sm:inline">
               {downloading ? "Generating…" : "Download as PDF"}
             </span>
           </button>
        </div>
      </div>

      {/* ── Exam Paper ─────────────────────────────────────────── */}
      <div
        id="paper-content"
        className="mobile-paper"
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "48px 56px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          fontFamily: "'Times New Roman', 'Georgia', serif",
        }}
      >

        {/* ── School Header ──────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: "24px",
              color: "#111",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {meta.schoolName ?? "VedaForge Academy"}
          </h1>
          <p style={{ margin: "4px 0", fontSize: "16px", color: "#222", fontWeight: 700 }}>
            Subject: {meta.subject ?? "—"} | Class: {meta.class ?? "—"}
          </p>
        </div>

        {/* ── Time + Marks row ───────────────────────────────── */}
        <div
          className="mobile-time-marks"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: 700,
            color: "#111",
            margin: "16px 0",
          }}
        >
          <span>Time Allowed: {meta.timeAllowed ?? "60 minutes"}</span>
          <span>Maximum Marks: {meta.totalMarks ?? 0}</span>
        </div>

        {/* ── General instructions ───────────────────────────── */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "14px" }}>General Instructions:</p>
          <ul style={{ margin: 0, paddingLeft: "24px", fontSize: "13px", color: "#333", lineHeight: 1.6 }}>
            {(meta.instructions ?? ["All questions are compulsory unless stated otherwise."]).map((inst: string, i: number) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #111", margin: "16px 0" }} />

        {/* ── Student info ───────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 32px",
            fontSize: "14px",
            color: "#111",
            padding: "16px 0",
            borderBottom: "1px solid #ccc",
            marginBottom: "32px",
          }}
        >
          {[
            "Name",
            "Roll Number",
            "Section",
            "Date",
          ].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
              <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{label}:</span>
              <span
                style={{
                  flex: 1,
                  borderBottom: "1px solid #666",
                  height: "20px",
                  display: "inline-block",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Sections ───────────────────────────────────────── */}
        {paper.sections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: "32px" }}>
            {/* Section heading — centered bold */}
            <div style={{ textAlign: "center", margin: "0 0 4px" }}>
              <h2
                style={{
                  fontFamily: "inherit",
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#111",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "inline",
                }}
              >
                {section.title}
              </h2>
            </div>
            {/* Type label */}
            <p
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "13px",
                color: "#333",
                margin: "2px 0 2px",
              }}
            >
              {section.type}
            </p>
            {/* Instruction */}
            <p
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontSize: "12px",
                color: "#555",
                margin: "0 0 14px",
              }}
            >
              {section.instruction}
            </p>

            {/* Questions */}
            {section.questions.map((q) => {
              const diffLabel = DIFF_LABELS[q.difficulty?.toLowerCase()] ?? q.difficulty;
              const isOptions = Array.isArray(q.options) && q.options.length > 0;

              return (
                <div key={q.number} style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    {/* Q number */}
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                        minWidth: "28px",
                        color: "#111",
                      }}
                    >
                      {q.number}.
                    </span>

                    {/* Question text */}
                    <p
                      className="mobile-question-text"
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "#111",
                        margin: 0,
                      }}
                    >
                      {q.text}
                    </p>

                    {/* Marks */}
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#555",
                        whiteSpace: "nowrap",
                      }}
                    >
                      [{q.marks} Mark{q.marks !== 1 ? "s" : ""}]
                    </span>
                  </div>

                  {/* MCQ options */}
                  {isOptions && (
                    <div
                      style={{
                        marginTop: "8px",
                        marginLeft: "88px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {q.options!.map((opt, oi) => (
                        <span
                          key={oi}
                          style={{ fontSize: "13px", color: "#222" }}
                        >
                          {String.fromCharCode(97 + oi)}) {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* ── End of Question Paper ─────────────────────────── */}
        <p
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "13px",
            color: "#333",
            margin: "24px 0 0",
            letterSpacing: "0.05em",
          }}
        >
          — End of Question Paper —
        </p>

        {/* ── Answer Key ─────────────────────────────────────── */}
        {Array.isArray(paper.answerKey) && paper.answerKey.length > 0 && (
          <div
            style={{
              borderTop: "2px solid #111",
              paddingTop: "20px",
              marginTop: "28px",
            }}
          >
            <h2
              style={{
                fontFamily: "inherit",
                fontWeight: 800,
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 12px",
                color: "#111",
              }}
            >
              Answer Key
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {paper.answerKey.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#222",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontWeight: 700, flexShrink: 0, minWidth: "28px" }}>
                    {a.questionNumber}.
                  </span>
                  <span style={{ lineHeight: 1.6 }}>{a.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Static Buttons at Bottom ──────────────────── */}
      <div 
        className="md:hidden" 
        style={{ 
          padding: "32px 16px 120px 16px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px",
          width: "100%",
        }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px 24px",
            background: "#111827",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "9999px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: downloading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-bricolage), sans-serif",
            opacity: downloading ? 0.75 : 1,
            width: "100%",
          }}
        >
          <Download size={18} />
          {downloading ? "Generating…" : "Download as PDF"}
        </button>

        <button
          onClick={() => router.push(`/assignments/${id}/generating`)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px 24px",
            background: "#FFFFFF",
            border: "1px solid #111827",
            color: "#111827",
            borderRadius: "9999px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-bricolage), sans-serif",
            width: "100%",
          }}
        >
          <RefreshCw size={18} />
          Regenerate
        </button>
      </div>

      {/* Print styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          body * { visibility: hidden; }
          #paper-content, #paper-content * { margin: 0; padding: 0; visibility: visible; }
          #paper-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20mm; }
        }
        @media (max-width: 768px) {
          .responsive-download-btn {
            width: 44px !important;
            height: 44px !important;
            padding: 0 !important;
            border-radius: 8px !important;
          }
          .mobile-container {
             padding: 16px 0 80px 0 !important;
          }
          .mobile-header, .mobile-actions {
             margin-left: 16px;
             margin-right: 16px;
          }
          .mobile-top-stmt {
             padding: 12px !important;
          }
          .mobile-top-stmt p {
             font-size: 14px !important;
          }
          .mobile-paper {
             padding: 24px 16px !important;
             border-radius: 0 !important;
             border-left: none !important;
             border-right: none !important;
             box-shadow: none !important;
             margin-top: 16px !important;
          }
          .mobile-question-text {
             font-size: 12px !important;
          }
          .mobile-time-marks {
             flex-direction: column !important;
             gap: 8px !important;
             margin: 12px 0 !important;
             font-size: 13px !important;
          }
          .mobile-stack-btns {
             flex-direction: column !important;
             width: 100% !important;
          }
          .mobile-stack-btns button {
             width: 100% !important;
             justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
