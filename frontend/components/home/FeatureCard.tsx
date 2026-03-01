import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  delay?: number;
}

/**
 * A reusable card component to display features with an icon, title, and description.
 * Includes a fade-in animation with an optional delay.
 */
export function FeatureCard({ title, desc, icon, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className="glass-card p-8 rounded-3xl animate-fade-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-flash-text-muted leading-relaxed">{desc}</p>
    </div>
  );
}
