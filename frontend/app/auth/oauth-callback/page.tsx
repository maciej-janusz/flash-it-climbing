'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthContext';
import { useToast } from '@/hooks/useToast';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const toast = useToast();
  const initiated = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state && !initiated.current) {
      initiated.current = true;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const backendUrl = `${apiBaseUrl}/auth/google/callback`;
      const redirectUri = `${window.location.origin}/auth/oauth-callback`;

      fetch(`${backendUrl}?code=${code}&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`, {
        method: 'GET',
        credentials: 'include'
      })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          
          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            toast.success('Witaj z powrotem! Zalogowano pomyślnie.');
            await refreshUser();
            router.push('/');
          } else {
            toast.error('Błąd: Nie otrzymano klucza dostępu.');
            router.push('/');
          }
        } else {
          toast.error('Autoryzacja nie powiodła się.');
          router.push('/');
        }
      })
      .catch((err) => {
        console.error('OAuth Error:', err);
        toast.error('Wystąpił błąd połączenia z serwerem.');
        router.push('/');
      });
    }
  }, [searchParams, router, refreshUser, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-flash-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-flash-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border-4 border-flash-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(var(--flash-primary-rgb),0.3)]" />
          <div className="absolute inset-2 border-2 border-white/5 rounded-full animate-pulse" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            Finalizowanie logowania
          </h1>
          <p className="text-flash-text-muted font-bold tracking-tight">
            Zaraz zostaniesz przekierowany do aplikacji...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-flash-bg">
        <div className="w-16 h-16 border-4 border-flash-primary/20 border-t-flash-primary rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}