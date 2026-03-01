// app/callback/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Autoryzacja w toku...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      const backendUrl = `http://localhost:8000/auth/google/callback`;
      const redirectUri = `http://localhost:3000/callback`;

      fetch(`${backendUrl}?code=${code}&state=${state}&redirect_uri=${redirectUri}`, {
        method: 'GET',
        credentials: 'include'
      })
      .then((res) => {
        if (res.ok) {
          setStatus('Zalogowano pomyślnie! Przekierowywanie...');
          const destination = state.startsWith('/') ? state : '/dashboard';
          router.push(destination);
        } else {
          setStatus('Błąd autoryzacji na backendzie.');
        }
      })
      .catch(() => setStatus('Wystąpił błąd połączenia.'));
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold mb-4">{status}</h1>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-xl font-bold mb-4">Inicjalizacja...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}