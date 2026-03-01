"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal("login");
    }
  }, [user, loading, openAuthModal]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-flash-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-flash-text-muted font-bold animate-pulse">Weryfikacja autoryzacji...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-6 rounded-full bg-flash-primary/10 text-flash-primary">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Ta strona wymaga zalogowania</h2>
          <p className="text-flash-text-muted">Zaloguj się, aby uzyskać dostęp do tej funkcjonalności.</p>
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-8 py-3 bg-flash-primary text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-flash-primary/20"
        >
          Zaloguj się teraz
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
