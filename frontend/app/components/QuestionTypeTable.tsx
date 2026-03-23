"use client";

import { useState, useRef, useEffect } from "react";
import { Minus, Plus, X, ChevronDown } from "lucide-react";

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
] as const;

export type QuestionType = (typeof QUESTION_TYPE_OPTIONS)[number];

export interface QTypeRow {
  type: QuestionType;
  count: number;
  marks: number;
}

interface Props {
  rows: QTypeRow[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: "type" | "count" | "marks", value: string | number) => void;
  errors?: Record<number, string>;
}

// ── Custom Dropdown ───────────────────────────────────────────────────────────
function CustomDropdown({
  value,
  options,
  onChange,
  hasError,
}: {
  value: string;
  options: readonly string[];
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "8px 32px 8px 12px",
          border: `1px solid ${hasError ? "#FCA5A5" : "#E5E5E5"}`,
          borderRadius: "10px",
          fontSize: "13px",
          color: "#111111",
          backgroundColor: "#FFFFFF",
          cursor: "pointer",
          fontFamily: "inherit",
          outline: "none",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#111111"; }}
        onBlur={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.borderColor = hasError ? "#FCA5A5" : "#E5E5E5"; }}
      >
        {value}
      </button>
      <ChevronDown
        size={13}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: `translateY(-50%) rotate(${open ? "180" : "0"}deg)`,
          pointerEvents: "none",
          color: "#666666",
          transition: "transform 0.2s",
        }}
      />

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#111111",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: opt === value ? "#222222" : "transparent",
                border: "none",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#FFFFFF",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#333333"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = opt === value ? "#222222" : "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function Stepper({ value, onDecrement, onIncrement }: { value: number; onDecrement: () => void; onIncrement: () => void }) {
  const canDecrement = value > 1;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden" }}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        style={{
          width: "28px",
          height: "30px",
          border: "none",
          background: canDecrement ? "#FFFFFF" : "#F9F9F9",
          cursor: canDecrement ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: canDecrement ? "#444444" : "#CCCCCC",
          borderRight: "1px solid #E5E5E5",
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => { if (canDecrement) (e.currentTarget as HTMLButtonElement).style.background = "#F5F5F5"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = canDecrement ? "#FFFFFF" : "#F9F9F9"; }}
      >
        <Minus size={11} />
      </button>
      <div
        style={{
          width: "32px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 600,
          color: "#111111",
          backgroundColor: "#FFFFFF",
          userSelect: "none",
        }}
      >
        {value}
      </div>
      <button
        type="button"
        onClick={onIncrement}
        style={{
          width: "28px",
          height: "30px",
          border: "none",
          background: "#FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#444444",
          borderLeft: "1px solid #E5E5E5",
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F5F5F5"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF"; }}
      >
        <Plus size={11} />
      </button>
    </div>
  );
}

// ── Main Table ────────────────────────────────────────────────────────────────
export default function QuestionTypeTable({ rows, onAdd, onRemove, onChange, errors = {} }: Props) {
  const totalQuestions = rows.reduce((s, r) => s + r.count, 0);
  const totalMarks = rows.reduce((s, r) => s + r.marks * r.count, 0);

  return (
    <div>
      {/* ── Column headers ── */}
      <div
        className="hidden md:grid gap-[8px] pb-[10px] border-b border-[#E5E5E5] mb-[8px]"
        style={{
          gridTemplateColumns: "1fr 32px 150px 120px",
        }}
      >
        {["Question Type", "", "No. of Questions", "Marks"].map((h, i) => (
          <span
            key={i}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#999999",
              textAlign: i >= 2 ? "center" : "left",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* ── Rows ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {rows.map((row, i) => (
          <div key={i}>
            <div className="flex flex-col md:grid md:grid-cols-[1fr_32px_150px_120px] gap-2 md:gap-[8px] md:items-center bg-[#F9FAFB] md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none border border-[#E5E7EB] md:border-none">
              <div className="flex gap-2 items-center col-span-2">
                <div className="flex-1">
                  {/* Custom Dropdown (replaces HTML <select>) */}
                  <CustomDropdown
                    value={row.type}
                    options={QUESTION_TYPE_OPTIONS}
                    onChange={(val) => onChange(i, "type", val as QuestionType)}
                    hasError={!!errors[i]}
                  />
                </div>

                {/* Remove (X) button */}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  disabled={rows.length === 1}
                  title={rows.length === 1 ? "At least 1 row required" : "Remove"}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    background: rows.length === 1 ? "#F9F9F9" : "#FFFFFF",
                    cursor: rows.length === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: rows.length === 1 ? "#CCCCCC" : "#999999",
                    transition: "background 0.1s, color 0.1s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { if (rows.length > 1) { (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"; (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = rows.length === 1 ? "#F9F9F9" : "#FFFFFF"; (e.currentTarget as HTMLButtonElement).style.color = rows.length === 1 ? "#CCCCCC" : "#999999"; }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Count stepper */}
              <div className="flex justify-between items-center md:justify-center mt-1 md:mt-0">
                <span className="md:hidden text-[13px] font-semibold text-[#444444]">No. of Questions:</span>
                <Stepper
                  value={row.count}
                  onDecrement={() => onChange(i, "count", Math.max(1, row.count - 1))}
                  onIncrement={() => onChange(i, "count", row.count + 1)}
                />
              </div>

              {/* Marks stepper */}
              <div className="flex justify-between items-center md:justify-center mt-1 md:mt-0">
                <span className="md:hidden text-[13px] font-semibold text-[#444444]">Marks:</span>
                <Stepper
                  value={row.marks}
                  onDecrement={() => onChange(i, "marks", Math.max(1, row.marks - 1))}
                  onIncrement={() => onChange(i, "marks", row.marks + 1)}
                />
              </div>
            </div>
            {errors[i] && (
              <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{errors[i]}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Add Question Type button ── */}
      <button
        type="button"
        onClick={onAdd}
        disabled={rows.length >= QUESTION_TYPE_OPTIONS.length}
        style={{
          marginTop: "14px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "0",
          background: "none",
          border: "none",
          cursor: rows.length >= QUESTION_TYPE_OPTIONS.length ? "not-allowed" : "pointer",
          fontSize: "13px",
          fontWeight: 600,
          color: rows.length >= QUESTION_TYPE_OPTIONS.length ? "#CCCCCC" : "#111111",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: rows.length >= QUESTION_TYPE_OPTIONS.length ? "#E5E5E5" : "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          <Plus size={13} />
        </span>
        Add Question Type
      </button>

      {/* ── Totals row (right-aligned) ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "2px",
          marginTop: "12px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#444444" }}>
          <span style={{ fontWeight: 600, color: "#111111" }}>Total Questions : </span>{totalQuestions}
        </span>
        <span style={{ fontSize: "13px", color: "#444444" }}>
          <span style={{ fontWeight: 600, color: "#111111" }}>Total Marks : </span>{totalMarks}
        </span>
      </div>
    </div>
  );
}
