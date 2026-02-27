"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <Link
          href="/"
          className="h-full max-h-12 flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image 
            src="/logo.svg" 
            alt="Flash It" 
            width={120}
            height={48} 
            className="h-full w-auto object-contain" 
          />
        </Link>
        
        <div className="hidden md:block flex-1 max-w-2xl">
          <SearchBar />
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm font-bold text-flash-text-muted hover:text-white transition-colors">
            Explore
          </Link>
          <Link href="/add-route" className="bg-flash-primary text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-flash-primary/20 hover:scale-105 active:scale-95 transition-all">
            Add route
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="text-flash-primary p-2 focus:outline-none"
             aria-label="Toggle Menu"
           >
             <span className="text-3xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 animate-slide-down bg-flash-bg/95 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            <div className="pb-4 border-b border-white/5">
              <SearchBar />
            </div>
            <nav className="flex flex-col gap-4">
              <Link 
                href="/explore" 
                className="text-lg font-bold text-flash-text py-2 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eksploruj
              </Link>
              <Link 
                href="/add-route" 
                className="bg-flash-primary text-black px-6 py-4 rounded-2xl text-center font-black shadow-lg shadow-flash-primary/20 active:scale-95 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DODAJ NOWĄ DROGĘ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
