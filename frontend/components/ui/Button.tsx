"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl";
  
  const variants = {
    primary: "bg-gradient-to-r from-flash-primary to-accent text-black shadow-lg shadow-flash-primary/20 hover:scale-[1.02]",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/5",
    outline: "border-2 border-flash-primary/30 text-flash-primary hover:bg-flash-primary/10",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-4 text-sm",
    lg: "px-8 py-5 text-base",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
