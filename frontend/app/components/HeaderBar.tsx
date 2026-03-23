"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, LayoutGrid, ChevronDown, Bell, Menu, X, Users, FileText, BookOpen, Clock, Settings, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function HeaderBar() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", icon: LayoutGrid, path: "/" },
    { name: "My Groups", icon: Users, path: "/groups" },
    { name: "Assignments", icon: FileText, path: "/assignments" },
    { name: "AI Teacher's Toolkit", icon: BookOpen, path: "/toolkit" },
    { name: "My Library", icon: Clock, path: "/library" },
  ];

  return (
    <>
      <header
        className="header-bar"
        style={{
          /* Fixed to viewport — never scrolls with page content */
          position: "fixed",
          top: 12,
          right: 12,
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          /* Must be above page content but below drawers (zIndex 60+) */
          zIndex: 40,
          fontFamily: "var(--font-bricolage), sans-serif",
          /* Prevent any accidental layout shifts */
          boxSizing: "border-box",
        }}
      >
        {/* Desktop Left Items hidden on mobile */}
        <div className="hidden md:flex items-center gap-[16px] text-[#6B7280]">
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#374151",
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LayoutGrid size={18} strokeWidth={2} color="#9CA3AF" />
            <span
              style={{
                fontWeight: 500,
                fontSize: "15px",
                color: "#9CA3AF",
              }}
            >
              Assignment
            </span>
          </div>
        </div>

        {/* Mobile Left Items (Logo) hidden on desktop */}
        <div className="md:hidden flex items-center gap-[8px] cursor-pointer" onClick={() => router.push("/")}>
          <img src="/logo.png" alt="VedaAI Logo" style={{ height: "24px", width: "auto" }} />
          <span style={{ fontWeight: 800, fontSize: "18px", color: "#111827", letterSpacing: "-0.5px" }}>
            VedaAI
          </span>
        </div>

        {/* Right — Bell + Avatar + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            aria-label="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              color: "#6B7280",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "none")
            }
          >
            <Bell size={20} />
          </button>

          {/* User Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#F97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "12px",
                flexShrink: 0,
              }}
            >
              JD
            </div>
            <span
              className="hidden md:inline"
              style={{
                fontWeight: 500,
                fontSize: "14px",
                color: "#374151",
              }}
            >
              John Doe
            </span>
            <ChevronDown className="hidden md:block" size={14} color="#6B7280" style={{ cursor: "pointer" }} />
          </div>

          {/* Mobile Hamburger hidden on desktop */}
          <button
            className="md:hidden"
            onClick={() => setIsDrawerOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#374151",
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Slide-in Drawer overlay */}
      {isDrawerOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 60,
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer content */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "280px",
          backgroundColor: "#FFFFFF",
          zIndex: 70,
          transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          padding: "24px 20px",
          fontFamily: "var(--font-bricolage), sans-serif",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: "4px" }}>
            <X size={24} />
          </button>
        </div>

        {/* Create Assignment Button */}
        <button
          onClick={() => { setIsDrawerOpen(false); router.push("/assignments/create"); }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px 20px",
            background: "#111827",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "24px",
            fontFamily: "inherit",
          }}
        >
          <Sparkles size={16} />
          Create Assignment
        </button>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== "/" || pathname === "/");
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => { e.preventDefault(); setIsDrawerOpen(false); router.push(item.path); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#111827" : "#6B7280",
                  backgroundColor: isActive ? "#F3F4F6" : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "15px",
                }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#111827" : "#6B7280"} />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Settings and School Profile */}
        <div>
          <a
            href="/settings"
            onClick={(e) => { e.preventDefault(); setIsDrawerOpen(false); router.push("/settings"); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              textDecoration: "none",
              color: "#6B7280",
              fontWeight: 500,
              fontSize: "15px",
              marginBottom: "16px",
            }}
          >
            <Settings size={20} />
            Settings
          </a>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              backgroundColor: "#F3F4F6",
              borderRadius: "12px",
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
                fontSize: "20px"
              }}
            >
              🐵
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#111827" }}>
                Delhi Public School
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#6B7280" }}>
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Desktop: fixed pill header sitting to the right of the sidebar ── */
        .header-bar {
          position: fixed !important;   /* force fixed even if a parent has transform */
          top: 12px;
          left: 327px;   /* sidebar width + gap */
          right: 12px;
        }

        /* ── Mobile: span full width with small inset ── */
        @media (max-width: 768px) {
          .header-bar {
            left: 12px !important;
            padding: 0 16px !important;
          }
        }
      `}</style>
    </>
  );
}