import { RouteCard } from "./RouteCard";
import type { Route } from "@/types/api";

interface RouteListProps {
  routes: Route[];
}

/**
 * A component that renders a list of RouteCard components or a "no results" message.
 */
export function RouteList({ routes }: RouteListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {routes.length > 0 ? (
        routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))
      ) : (
        <div className="md:col-span-2 text-center py-12 glass-card rounded-2xl border-dashed">
          <p className="text-flash-text-disabled font-bold">
            Brak dróg spełniających kryteria.
          </p>
        </div>
      )}
    </div>
  );
}
