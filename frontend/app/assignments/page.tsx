"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore, Assignment } from "@/store/assignmentStore";
import { MoreVertical, Plus, FileText } from "lucide-react";
import SmoothScroll from "../components/SmoothScroll";

// ── Date Formatter ──────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

// ── AssignmentCard ──────────────────────────────────────────────────────────
function AssignmentCard({
  assignment,
  onDelete,
}: {
  assignment: Assignment;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const isDone = assignment.status === "done";
  const isProcessing =
    assignment.status === "processing" || assignment.status === "pending";
  const isError = assignment.status === "error";

  const handleCardClick = () => {
    if (isDone) router.push(`/assignments/${assignment._id}/paper`);
    else if (isError) router.push(`/assignments/${assignment._id}/generating`);
    else router.push(`/assignments/${assignment._id}/generating`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        padding: "20px",
        position: "relative",
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "120px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "#111827",
            lineHeight: 1.4,
            flex: 1,
            margin: 0,
            fontFamily: "var(--font-bricolage), sans-serif",
          }}
        >
          {assignment.title}
        </p>

        {/* 3-dot menu */}
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6B7280",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "28px",
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 100,
                overflow: "hidden",
                minWidth: "160px",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  if (isDone)
                    router.push(`/assignments/${assignment._id}/paper`);
                  else
                    router.push(
                      `/assignments/${assignment._id}/generating`
                    );
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: "#374151",
                  cursor: "pointer",
                  fontFamily: "var(--font-bricolage), sans-serif",
                }}
              >
                View Assignment
              </button>

              <div style={{ height: "1px", background: "#F3F4F6" }} />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(assignment._id);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: "#DC2626",
                  cursor: "pointer",
                  fontFamily: "var(--font-bricolage), sans-serif",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status badge — only show for error / processing */}
      {(isError || isProcessing) && (
        <div style={{ marginTop: "8px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "var(--font-bricolage), sans-serif",
              backgroundColor: isError ? "#FEE2E2" : "#FEF3C7",
              color: isError ? "#991B1B" : "#92400E",
            }}
          >
            {isError ? "Error" : "Generating…"}
          </span>
        </div>
      )}

      {/* Dates row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#6B7280",
          marginTop: "auto",
          paddingTop: "16px",
          fontFamily: "var(--font-bricolage), sans-serif",
        }}
      >
        <span>
          <span style={{ fontWeight: 600, color: "#374151" }}>Assigned on</span>
          {" : "}
          {formatDate(assignment.createdAt)}
        </span>
        <span>
          <span style={{ fontWeight: 600, color: "#374151" }}>Due</span>
          {" : "}
          {formatDate(assignment.dueDate)}
        </span>
      </div>

      {/* Retry button for error state */}
      {isError && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/assignments/${assignment._id}/generating`);
          }}
          style={{
            width: "100%",
            padding: "10px 0",
            marginTop: "12px",
            backgroundColor: "#111827",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "var(--font-bricolage), sans-serif",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#1F2937";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#111827";
          }}
        >
          <FileText size={14} />
          Retry
        </button>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, isLoading, error, fetchAssignments, deleteAssignment } =
    useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
    const interval = setInterval(fetchAssignments, 6000);
    return () => clearInterval(interval);
  }, [fetchAssignments]);

  return (
    <SmoothScroll>
      <div
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          paddingBottom: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto", width: "100%" }}>
          {/* ── Assignment Grid / Empty State ──────────────────────────────────────────── */}
          {isLoading && assignments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF", fontSize: "14px" }}>
              Loading assignments…
            </div>
          ) : error || (!isLoading && assignments.length === 0) ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#111827",
                fontFamily: "var(--font-bricolage), sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Highly Accurate SVG Illustration matching exactFirstPage.png */}
              <svg width="300" height="300" viewBox="0 0 160 160" fill="none" style={{ marginBottom: "-10px" }}>
                {/* Main subtle gray circle */}
                <circle cx="80" cy="80" r="50" fill="#E5E7EB" opacity="0.6" />
                
                {/* Background decorative square top-right */}
                <rect x="94" y="50" width="22" height="12" rx="3" fill="#FFFFFF" />
                <circle cx="100" cy="56" r="1.5" fill="#9CA3AF" />
                <line x1="104" y1="56" x2="110" y2="56" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />

                {/* Document Base */}
                <rect x="64" y="48" width="40" height="52" rx="4" fill="#FFFFFF" />
                
                {/* Document Lines */}
                <line x1="72" y1="60" x2="88" y2="60" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                <line x1="72" y1="70" x2="94" y2="70" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="72" y1="80" x2="94" y2="80" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="72" y1="90" x2="84" y2="90" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />

                {/* Magnifying Glass */}
                <circle cx="90" cy="85" r="16" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="3" />
                <line x1="102" y1="97" x2="112" y2="107" stroke="#D1D5DB" strokeWidth="5" strokeLinecap="round" />
                
                {/* Red Cross inside Magnifying Glass */}
                <path d="M85 80L95 90M95 80L85 90" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

                {/* Decorative Swirl (Left) */}
                <path d="M52 68 C 64 68, 55 52, 65 52" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                
                {/* Decorations */}
                <path d="M52 95 L49 100 L54 103 L57 98 Z" fill="#60A5FA" />
                <circle cx="112" cy="88" r="2" fill="#3B82F6" />
                <circle cx="95" cy="40" r="1.5" fill="#9CA3AF" />
              </svg>

              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.5px" }}>
                No assignments yet
              </h2>
              <p style={{ fontSize: "15px", color: "#6B7280", maxWidth: "420px", lineHeight: "1.6", marginBottom: "32px", fontWeight: 400 }}>
                Get started by creating your first assignment. You can set up rubrics, define marking criteria, and let AI assist with grading.
              </p>
              
              {/* Empty state create button matching screenshot with exact hover effects */}
              <button
                onClick={() => router.push("/assignments/create")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "linear-gradient(180deg, #111827 0%, #000000 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "9999px",
                  fontWeight: 500,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s",
                  fontFamily: "var(--font-bricolage), sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.2)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02) translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 14px rgba(0,0,0,0.15)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "none";
                }}
              >
                <Plus size={18} />
                Create Your First Assignment
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "16px",
                }}
              >
                {assignments.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    onDelete={deleteAssignment}
                  />
                ))}
              </div>

              {/* + Create Assignment Button at bottom middle */}
              <div
                className="hidden md:flex justify-center fixed bottom-8 z-50"
                style={{ left: "calc(50% + 163.5px)", transform: "translateX(-50%)" }}
              >
                <button
                  onClick={() => router.push("/assignments/create")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    background: "linear-gradient(180deg, #111827 0%, #000000 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s",
                    fontFamily: "var(--font-bricolage), sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.2)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02) translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 14px rgba(0,0,0,0.15)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "none";
                  }}
                >
                  <Plus size={18} />
                  Create Assignment
                </button>
              </div>

              {/* Mobile Floating + Create Assignment Button */}
              <button
                className="lg:hidden"
                onClick={() => router.push("/assignments/create")}
                style={{
                  position: "fixed",
                  bottom: "80px",
                  right: "20px",
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  color: "#E05C2A",
                  fontSize: "28px",
                  fontWeight: "300",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 51,
                  boxShadow: "0 4px 16px rgba(224, 92, 42, 0.4)",
                }}
              >
                +
              </button>
            </>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}
