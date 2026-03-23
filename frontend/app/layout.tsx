import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import HeaderBar from "./components/HeaderBar";
import ClickBurst from "./components/ClickBurst";
import Sidebar from "./components/Sidebar";
import FooterNav from "./components/FooterNav";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "VedaForge – AI-Powered Assessment Creator",
  description: "Generate customized question papers with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body style={{ backgroundColor: "#DFDFDF", margin: 0, padding: 0 }}>
        <ClickBurst />
        
        {/* Persistent Layout Elements */}
        <Sidebar />
        <HeaderBar />
        <FooterNav />

        {/* Main Content Area */}
        <main className="main-content">
          {children}
        </main>

        <style>{`
          .main-content {
            margin-left: 327px;
            margin-top: 80px;
            min-height: calc(100vh - 80px);
            padding: 0 12px 12px 0;
          }
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding: 0 0 100px 0;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
