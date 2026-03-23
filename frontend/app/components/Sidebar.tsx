"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, FileText, BookOpen, Clock, Settings, Sparkles } from "lucide-react";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const assignments = useAssignmentStore(
    state => state.assignments
  );
  const count = assignments.length;

  const navItems = [
    { name: "Home", icon: LayoutGrid, path: "/" },
    { name: "My Groups", icon: Users, path: "/groups" },
    { name: "Assignments", icon: FileText, path: "/assignments" },
    { name: "AI Teacher's Toolkit", icon: BookOpen, path: "/toolkit" },
    { name: "My Library", icon: Clock, path: "/library" },
  ];

  return (
    <aside
      className="hidden md:flex flex-col justify-between"
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        width: 304,
        bottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "var(--font-bricolage), sans-serif",
        zIndex: 50,
      }}
    >
      <div>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", paddingLeft: "12px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <img src="/logo.png" alt="VedaAI Logo" style={{ height: "40px", width: "auto" }} />
          <span style={{ fontWeight: 800, fontSize: "22px", color: "#111827", letterSpacing: "-0.5px" }}>
            VedaAI
          </span>
        </div>

        {/* Create Assignment Button */}
        <button
          onClick={() => router.push("/assignments/create")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px 20px",
            background: "linear-gradient(180deg, #374151 0%, #111827 100%)",
            color: "#FFFFFF",
            border: "2px solid #F97316",
            borderRadius: "999px",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(249,115,22,0.15)",
            fontFamily: "inherit",
          }}
        >
          <Sparkles size={16} fill="#FFFFFF" />
          Create Assignment
        </button>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== "/" || pathname === "/");
            return (
              <a
                key={item.name}
                href={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#111827" : "#6B7280",
                  backgroundColor: isActive ? "#F3F4F6" : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "14px",
                  transition: "all 0.1s ease",
                }}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#111827" : "#6B7280"} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                  <span>{item.name}</span>
                  {item.name === "Assignments" && count > 0 && (
                    <span style={{
                      background: '#E05C2A',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '999px',
                      padding: '2px 8px',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {count}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Settings Link */}
        <a
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            textDecoration: "none",
            color: "#6B7280",
            fontWeight: 500,
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          <Settings size={18} />
          Settings
        </a>

        {/* School Profile Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#F3F4F6",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#FFEDD5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: "20px"
            }}
          >
            🐵
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#111827" }}>
              Delhi Public School
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
