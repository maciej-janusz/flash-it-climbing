"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/hooks/useToast";

function AuthCallbackContent() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Standard SPA pattern: token is in the hash fragment (#token=...)
    // This keeps the token out of server logs
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);
        handleLoginSuccess();
      } else {
        checkQueryParams();
      }
    } else {
      checkQueryParams();
    }
  }, []);

  function checkQueryParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    if (error) {
      handleLoginError();
    }
  }

  async function handleLoginSuccess() {
    try {
      await refreshUser();
      toast.success("Zalogowano przez Google!");
      router.push("/");
    } catch (err) {
      handleLoginError();
    }
  }

  function handleLoginError() {
    toast.error("Wystąpił błąd podczas logowania przez Google.");
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-flash-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-flash-text-muted font-bold animate-pulse text-lg">Finalizowanie logowania Google...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
