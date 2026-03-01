"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const showToast = (message: string, type: ToastType = "info") => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type }];
  toastListeners.forEach((listener) => listener(toasts));
  
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastListeners.forEach((listener) => listener(toasts));
  }, 5000);
};

export function ToastContainer() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setActiveToasts(newToasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-slide-up pointer-events-auto min-w-[300px] max-w-md ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : toast.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-flash-primary/10 border-flash-primary/20 text-flash-primary"
          }`}
        >
          <span className="text-xl">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : toast.type === "error" ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </span>
          <p className="font-bold text-sm tracking-wide">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
