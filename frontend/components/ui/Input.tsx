"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-black text-flash-text-muted uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-flash-primary">
            {icon}
          </span>
        )}
        <input
          className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-flash-primary/40 focus:border-flash-primary/40 outline-none transition-all placeholder:text-flash-text-disabled text-white ${
            icon ? "pl-12" : ""
          } ${error ? "border-red-500/50" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-red-400 ml-1">{error}</p>}
    </div>
  );
}
