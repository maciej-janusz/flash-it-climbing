import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Flash It",
  description: "Starter Next.js + FastAPI + MongoDB stack"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

