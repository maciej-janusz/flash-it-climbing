import type { ReactNode } from "react";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Flash It",
  description: "Flash It — nowoczesna aplikacja wspinaczkowa",
};

import { AuthProvider } from "@/components/providers/AuthContext";
import { AuthModalWrapper } from "../components/auth/AuthModalWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-flash-bg text-flash-text font-sans selection:bg-flash-primary/30 selection:text-white">
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-7xl w-full px-4 md:px-8 py-8 md:py-12 animate-fade-in">{children}</main>
          <ToastContainer />
          <AuthModalWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
