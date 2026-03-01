import Link from "next/link";
import type { Route } from "@/types/api";

interface RouteCardProps {
  route: Route;
}

/**
 * Component for displaying an individual climbing route card.
 */
export function RouteCard({ route }: RouteCardProps) {
  return (
    <Link 
      href={`/route/${route.id}`}
      className="glass-card p-6 rounded-2xl hover:border-flash-primary/30 transition-all group hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-flash-primary transition-colors leading-tight">
            {route.name}
          </h3>
          <p className="text-xs text-flash-text-muted font-black mt-1 uppercase tracking-widest">
            {route.type === "boulder" ? "Bulder" : "Lina"}
          </p>
        </div>
        <span className="text-2xl font-black text-flash-primary drop-shadow-glow">
          {route.grade}
        </span>
      </div>
    </Link>
  );
}
