"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, FileText, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function FooterNav() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (pathname !== '/assignments/create') {
      setShow(true);
      return;
    }

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 200) {
        setShow(scrolled < 80 || scrolled > total - 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const navItems = [
    { name: "Home", icon: LayoutGrid, path: "/", action: () => router.push("/") },
    { name: "Assignments", icon: FileText, path: "/assignments", action: () => router.push("/assignments") },
    { name: "Library", icon: Clock, path: "/library", action: () => showToast("Coming Soon") },
    { name: "AI Toolkit", icon: Sparkles, path: "/toolkit", action: () => showToast("Coming Soon") },
  ];

  return (
    <>
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: "90px", left: "50%", transform: "translateX(-50%)",
          backgroundColor: "#333", color: "#fff", padding: "8px 16px", borderRadius: "8px", zIndex: 60,
          fontSize: "13px", fontFamily: "var(--font-bricolage), sans-serif"
        }}>
          {toastMsg}
        </div>
      )}
      <nav
        className="flex md:hidden"
        style={{
          position: "fixed",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "fit-content",
          minWidth: "280px",
          background: "#1a1a1a",
          borderRadius: "24px",
          padding: "10px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          gap: "32px",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          fontFamily: "var(--font-bricolage), sans-serif",
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        {navItems.map((item) => {
          let isActive = false;
          if (item.path === "/") {
            isActive = pathname === "/";
          } else {
            isActive = pathname.startsWith(item.path);
          }
          return (
            <button
              key={item.name}
              onClick={item.action}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                background: "none", border: "none", padding: "0", cursor: "pointer",
                color: isActive ? "#ffffff" : "#666666"
              }}
            >
              <item.icon size={20} color={isActive ? "#ffffff" : "#666666"} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: "10px", fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
            </button>
          )
        })}
      </nav>
    </>
  );
}
