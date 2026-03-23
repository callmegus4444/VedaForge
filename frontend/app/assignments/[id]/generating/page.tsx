"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentSocket } from "@/hooks/useAssignmentSocket";

export default function GeneratingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const navigatedRef = useRef(false);

  useAssignmentSocket((readyId) => {
    if (readyId === id && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push(`/assignments/${id}/paper`);
    }
  });

  // Fallback — also poll every 4 seconds in case socket misses
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://vedaforge-backend.onrender.com";
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/assignments/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.assignment?.status === "done" && !navigatedRef.current) {
            navigatedRef.current = true;
            router.push(`/assignments/${id}/paper`);
          }
          if (data.assignment?.status === "error") {
            clearInterval(interval);
            router.push(`/assignments?error=${id}`);
          }
        }
      } catch { /* silent */ }
    }, 4000);
    return () => clearInterval(interval);
  }, [id, router]);

  return (
    <div
      className="max-md:pb-[80px]!"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        padding: "40px 20px",
      }}
    >
      {/* Animated spinner */}
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid #F3E8FF",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "12px",
            borderRadius: "50%",
            border: "4px solid #FFF0E5",
            borderTopColor: "#F97316",
            animation: "spin 1.4s linear infinite reverse",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: "22px",
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          Generating your question paper…
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
          VedaForge AI is crafting your assessment. This usually takes 10–20
          seconds.
        </p>
      </div>

      {/* Animated dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
              opacity: 0.6,
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.4);opacity:1} }`}</style>
      </div>
    </div>
  );
}
