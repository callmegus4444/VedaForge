"use client";

import Link from "next/link";
import { FileText, Brain, Download, Upload, Settings, Sparkles, ArrowRight, CheckCircle, BarChart3, Users, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "var(--font-bricolage), sans-serif",
        paddingBottom: "60px",
      }}
    >
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 48px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            backgroundColor: "#F3F4F6",
            borderRadius: "999px",
            fontSize: "13px",
            color: "#6B7280",
            fontWeight: 500,
            marginBottom: "24px",
          }}
        >
          <Sparkles size={14} color="#F97316" />
          AI-Powered Assessment Platform
        </div>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            margin: "0 0 16px",
          }}
        >
          AI Academic Assessment System
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "#6B7280",
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0 auto 32px",
          }}
        >
          VedaAI enables educational institutions to deliver stronger academic results,
          increase parent confidence, and build long-term institutional reputation
          — all powered by intelligent automation.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/assignments/create"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "linear-gradient(180deg, #111827 0%, #000000 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <Sparkles size={16} />
            Create Assignment
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/assignments"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "#FFFFFF",
              color: "#374151",
              border: "1px solid #E5E7EB",
              borderRadius: "9999px",
              fontWeight: 500,
              fontSize: "15px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            View Assignments
          </Link>
        </div>
      </section>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          padding: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          { number: "98%", label: "AI Grades Accepted by Teachers" },
          { number: "30+", label: "Teacher Hours Saved Monthly" },
          { number: "87%", label: "Students Showed Improvement" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "32px", fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>
              {stat.number}
            </p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, fontWeight: 500 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── Features Grid ──────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "40px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          What VedaAI Enables
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "32px",
            maxWidth: "600px",
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Automates grading, delivers structured feedback, and provides deep learning analytics
          — helping institutions scale quality education effortlessly.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              icon: Brain,
              title: "AI-Powered Grading",
              desc: "Evaluate subjective and objective answers accurately using customizable rubric-based AI in seconds.",
              color: "#8B5CF6",
            },
            {
              icon: BarChart3,
              title: "Real-Time Analytics",
              desc: "Track evaluation trends, performance patterns, and grading consistency across assessments.",
              color: "#3B82F6",
            },
            {
              icon: Users,
              title: "Student Performance",
              desc: "Search any student and instantly view grades, feedback, and performance indicators.",
              color: "#10B981",
            },
            {
              icon: FileText,
              title: "Smart Question Papers",
              desc: "Generate structured exam papers from uploaded content with proper difficulty distribution.",
              color: "#F97316",
            },
            {
              icon: Download,
              title: "PDF Export",
              desc: "Download clean, professionally formatted question papers ready for printing.",
              color: "#EC4899",
            },
            {
              icon: Shield,
              title: "Privacy First",
              desc: "Student data is strictly protected. DPDP Act 2023 compliant with end-to-end encryption.",
              color: "#6366F1",
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                transition: "box-shadow 0.2s, transform 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: `${feat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <feat.icon size={20} color={feat.color} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "56px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "32px",
          }}
        >
          Three simple steps to generate a professional question paper.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              step: "01",
              icon: Upload,
              title: "Upload Your Content",
              desc: "Upload a PDF, image, or textbook chapter. Our RAG pipeline extracts every concept from the document.",
            },
            {
              step: "02",
              icon: Settings,
              title: "Configure Questions",
              desc: "Choose question types, marks per question, difficulty distribution, and set a due date.",
            },
            {
              step: "03",
              icon: Download,
              title: "Download Paper",
              desc: "AI generates a structured question paper with answer key. Download as PDF or print directly.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px 24px",
                border: "1px solid #E5E7EB",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#E5E7EB",
                  marginBottom: "12px",
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <item.icon size={22} color="#374151" />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "700px",
          margin: "56px auto 0",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #E5E7EB",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "#374151",
              lineHeight: 1.8,
              fontStyle: "italic",
              margin: "0 0 16px",
            }}
          >
            &ldquo;VedaAI reduced the time required for homework, assignments, and exam evaluation
            while maintaining consistent quality across sections. We saw faster result cycles and
            clearer academic insights within the first term.&rdquo;
          </p>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
            Dr. A. Sharma
          </p>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
            Principal, Horizon International School, Delhi
          </p>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          padding: "48px 24px 0",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          Ready to Create Your First Assessment?
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "24px",
          }}
        >
          Experience how VedaAI can improve results and deliver measurable academic impact.
        </p>
        <Link
          href="/assignments/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            background: "linear-gradient(180deg, #111827 0%, #000000 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
