import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export function GlassCard({ children, className = "", title, icon }: GlassCardProps) {
  return (
    <div className={`glass-card p-8 rounded-[2rem] ${className}`}>
      {(title || icon) && (
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {icon && <span className="text-flash-primary">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
