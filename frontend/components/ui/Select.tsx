"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-black text-flash-text-muted uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-flash-primary/40 focus:border-flash-primary/40 outline-none transition-all appearance-none text-white font-bold cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-flash-bg-secondary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-flash-text-muted font-black text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}
