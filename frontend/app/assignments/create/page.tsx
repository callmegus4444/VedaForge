"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mic, Loader2 } from "lucide-react";
import { useAssignmentStore } from "@/store/assignmentStore";
import FileUpload from "@/app/components/FileUpload";
import QuestionTypeTable from "@/app/components/QuestionTypeTable";

// ── Validation ────────────────────────────────────────────────────────────────
interface FormErrors {
  dueDate?: string;
  questionTypes?: string;
  rows?: Record<number, string>;
}

function validate(
  dueDate: string,
  questionTypes: { type: string; count: number; marks: number }[]
): FormErrors {
  const errors: FormErrors = {};
  if (!dueDate) {
    errors.dueDate = "Due date is required.";
  } else {
    const d = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) errors.dueDate = "Due date must be today or in the future.";
  }
  if (questionTypes.length === 0) {
    errors.questionTypes = "Add at least one question type.";
  } else {
    const rowErrors: Record<number, string> = {};
    const seen = new Set<string>();
    questionTypes.forEach((r, i) => {
      if (seen.has(r.type)) rowErrors[i] = `"${r.type}" already added.`;
      seen.add(r.type);
      if (r.count < 1) rowErrors[i] = "Questions must be ≥ 1.";
      if (r.marks < 1)
        rowErrors[i] =
          (rowErrors[i] ? rowErrors[i] + " " : "") + "Marks must be ≥ 1.";
    });
    if (Object.keys(rowErrors).length > 0) errors.rows = rowErrors;
  }
  return errors;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    formData,
    setFormField,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    resetForm,
  } = useAssignmentStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const todayStr = new Date().toISOString().split("T")[0];

  // Show buttons only when the sentinel (placed at page bottom) is near the viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearBottom(entry.isIntersecting),
      { rootMargin: "0px 0px 200px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    const errs = validate(formData.dueDate, formData.questionTypes);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://vedaforge-backend.onrender.com";

    try {
      let fileUrl: string | undefined;
      if (formData.file) {
        const fd = new FormData();
        fd.append("file", formData.file);
        const uploadRes = await fetch(`${API}/api/upload`, {
          method: "POST",
          body: fd,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.error ?? "File upload failed");
        }
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.fileUrl;
      }

      const body = {
        dueDate: formData.dueDate,
        questionTypes: formData.questionTypes,
        instructions: formData.instructions,
        fileUrl,
      };
      const res = await fetch(`${API}/api/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? "Failed to create assignment");
      }
      resetForm();
      router.push(`/assignments`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrors({ questionTypes: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Page wrapper ─────────────────────────────────────────────────── */}
      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "28px",
          /* Extra bottom padding so content isn't hidden behind fixed bar */
          /* desktop: clear the ~76px action bar; mobile: clear action bar + 72px footer nav */
          paddingBottom: "clamp(160px, 20vh, 200px)",
          position: "relative",
        }}
      >
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div style={{ width: "810px", maxWidth: "100%", marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/assignments")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
                color: "#6B7280",
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#6B7280" }}>
              Assignment
            </span>
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#111111",
              marginBottom: "4px",
              marginLeft: "26px",
            }}
          >
            Create Assignment
          </h1>
          <p style={{ fontSize: "13px", color: "#999999", marginLeft: "26px" }}>
            Set up a new assignment for your students
          </p>
        </div>

        {/* ── Progress Stepper ─────────────────────────────────────────── */}
        <div
          style={{
            width: "810px",
            maxWidth: "100%",
            marginBottom: "24px",
            paddingLeft: "26px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                flex: 1,
                height: "4px",
                backgroundColor: "#111111",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                flex: 1,
                height: "4px",
                backgroundColor: "#E5E5E5",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>

        {/* ── Main Card ──────────── */}
        <div
          style={{
            width: "810px",
            maxWidth: "calc(100% - 24px)",
            backgroundColor: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── Assignment Details inner card ── */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E5E5E5",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#111111",
                  marginBottom: "2px",
                }}
              >
                Assignment Details
              </h2>
              <p style={{ fontSize: "12px", color: "#999999" }}>
                Basic information about your assignment
              </p>
            </div>

            <FileUpload
              value={formData.file}
              onChange={(f) => setFormField("file", f)}
            />

            {/* ── Due Date ── */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#444444",
                  marginBottom: "6px",
                }}
              >
                Due Date
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="date"
                  min={todayStr}
                  value={formData.dueDate}
                  onChange={(e) => {
                    setFormField("dueDate", e.target.value);
                    if (errors.dueDate)
                      setErrors((p) => ({ ...p, dueDate: undefined }));
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 44px 10px 14px",
                    border: `1px solid ${errors.dueDate ? "#FCA5A5" : "#E5E5E5"}`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: formData.dueDate ? "#111111" : "#999999",
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    boxShadow: "none",
                    transition: "border-color 0.15s",
                    appearance: "none",
                    WebkitAppearance: "none",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "#111111";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      errors.dueDate ? "#FCA5A5" : "#E5E5E5";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#666666",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="12" y1="13" x2="12" y2="19" />
                    <line x1="9" y1="16" x2="15" y2="16" />
                  </svg>
                </div>
              </div>
              {errors.dueDate && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#DC2626",
                    marginTop: "4px",
                  }}
                >
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* ── Question Types ── */}
            <div>
              <QuestionTypeTable
                rows={formData.questionTypes}
                onAdd={addQuestionType}
                onRemove={removeQuestionType}
                onChange={(i, field, value) => {
                  updateQuestionType(i, field, value);
                  if (errors.rows?.[i] || errors.questionTypes) {
                    setErrors((p) => {
                      const rows = { ...p.rows };
                      delete rows[i];
                      return { ...p, rows, questionTypes: undefined };
                    });
                  }
                }}
                errors={errors.rows}
              />
              {errors.questionTypes && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#DC2626",
                    marginTop: "6px",
                  }}
                >
                  {errors.questionTypes}
                </p>
              )}
            </div>

            {/* ── Additional Information ── */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#444444",
                  marginBottom: "10px",
                }}
              >
                Additional Information{" "}
                <span style={{ fontWeight: 400, color: "#999999" }}>
                  (For better output)
                </span>
              </label>
              <div style={{ position: "relative" }}>
                <textarea
                  rows={4}
                  placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                  value={formData.instructions}
                  onChange={(e) => setFormField("instructions", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 12px",
                    /* No border on textarea — the parent card is the only border */
                    border: "none",
                    borderRadius: "0",
                    fontSize: "13px",
                    color: "#111111",
                    backgroundColor: "transparent",
                    resize: "none",
                    fontFamily: "inherit",
                    outline: "none",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#999999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mic size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sentinel — when this is visible, the user is near the bottom */}
        <div ref={sentinelRef} style={{ height: "1px", width: "100%" }} />
      </div>

      {/* ── Fixed bottom action bar — visible only near bottom on desktop ── */}
      <div className={`action-bar${nearBottom ? " action-bar--visible" : ""}`}>
        <div className="action-bar-inner">

          {/* Previous */}
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="btn-prev"
          >
            <ArrowLeft size={15} />
            Previous
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-next"
          >
            {submitting ? (
              <>
                <Loader2 size={15} style={{ animation: "spin 0.7s linear infinite" }} />
                Submitting...
              </>
            ) : (
              <>
                Next
                <ArrowRight size={15} />
              </>
            )}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0; position: absolute; right: 0;
          width: 100%; height: 100%; cursor: pointer;
        }
        input[type="date"]::-webkit-inner-spin-button { display: none; }

        /* ── Action bar ── */
        .action-bar {
          position: fixed;
          left: 325px;   /* sidebar width */
          right: 0;
          bottom: 0;
          z-index: 50;
          pointer-events: none;
          /* Very subtle fade — just enough to lift buttons off content */
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(243, 244, 246, 0.88) 60%,
            rgba(243, 244, 246, 1) 100%
          );
          padding-top: 28px;
          padding-bottom: 24px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          /* Desktop: hidden by default, slides up when near bottom */
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        /* Revealed when sentinel enters viewport */
        .action-bar--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .action-bar-inner {
          display: flex;
          gap: 12px;
          align-items: center;
          pointer-events: all;
        }

        /* Shared button base */
        .btn-prev, .btn-next {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 48px;
          width: 152px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background-color 0.15s;
        }

        .btn-prev {
          background-color: #FFFFFF;
          border: 1px solid #111111;
          color: #111111;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .btn-prev:hover { background-color: #F5F5F5; }

        .btn-next {
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        }
        .btn-next:hover:not(:disabled) { background-color: #333333; }
        .btn-next:disabled {
          background-color: #555555;
          cursor: not-allowed;
        }

        /* ── Mobile: scroll-reveal too, sits cleanly above the footer nav ── */
        @media (max-width: 768px) {
          .action-bar {
            left: 0;
            /*
              FooterNav: bottom:16px + ~56px height = top edge at ~72px from bottom.
              Add 8px breathing room → bottom: 80px.
            */
            bottom: 80px;
            padding-top: 16px;
            padding-bottom: 12px;
            /* No gradient on mobile — buttons just sit above nav, no fog */
            background: transparent;
          }

          .btn-prev, .btn-next {
            height: 46px;
            width: 140px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
