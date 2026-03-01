"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn, User as UserIcon, LogOut } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "./providers/AuthContext";
import { AuthModal } from "./auth/AuthModal";
import { Button } from "./ui/Button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();

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
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/add-route" className="bg-flash-primary text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-flash-primary/20 hover:scale-105 active:scale-95 transition-all">
                Add route
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10 group cursor-pointer relative">
                <div className="w-8 h-8 rounded-full bg-flash-primary/20 flex items-center justify-center text-flash-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-black text-white">{user.first_name}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-flash-text-muted hover:text-red-400 transition-colors"
                  title="Wyloguj"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => openAuthModal("login")}
            >
              <LogIn className="w-4 h-4" /> Zaloguj się
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-4 md:hidden">
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="text-flash-primary p-2 focus:outline-none"
             aria-label="Toggle Menu"
           >
             <span className="text-3xl">{isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}</span>
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
              {user ? (
                <>
                  <Link 
                    href="/add-route" 
                    className="bg-flash-primary text-black px-6 py-4 rounded-2xl text-center font-black shadow-lg shadow-flash-primary/20 active:scale-95 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DODAJ NOWĄ DROGĘ
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-bold text-red-400 py-4 border-t border-white/5 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Wyloguj się
                  </button>
                </>
              ) : (
                <Button 
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                  onClick={() => {
                    openAuthModal("login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="w-5 h-5" /> Zaloguj się
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
