"use client";

import React, { useState } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ username: email, password });
        onClose();
      } else {
        await register({ email, password, first_name: firstName, last_name: lastName });
        setMode("login");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    
    const frontendCallbackUrl = `${window.location.origin}/auth/oauth-callback`;
    
    const res = await fetch(`${apiBaseUrl}/auth/google/authorize?redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      window.location.href = data.authorization_url;
    }
  };

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 shadow-2xl animate-slide-up overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-flash-text-muted hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10">
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter">
              {mode === "login" ? "Witaj ponownie" : "Dołącz do nas"}
            </h2>
            <p className="text-flash-text-muted mt-2">
              {mode === "login" 
                ? "Zaloguj się, aby dodawać nowe drogi." 
                : "Utwórz konto, aby zacząć się wspinać."}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  required
                  label="Imię"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Maciej"
                />
                <Input
                  required
                  label="Nazwisko"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Janusz"
                />
              </div>
            )}
            
            <Input
              required
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
            />
            
            <Input
              required
              type="password"
              label="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full mt-4 py-4"
            >
              {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-flash-bg px-4 text-flash-text-disabled">lub kontynuuj przez</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-4 flex items-center justify-center gap-3 group overflow-hidden relative"
            onClick={handleGoogleLogin}
          >
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-flash-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-bold">Google</span>
          </Button>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-flash-text-muted text-sm">
              {mode === "login" ? "Nie masz konta?" : "Masz już konto?"}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="ml-2 text-flash-primary font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                {mode === "login" ? "Zarejestruj się" : "Zaloguj się"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
