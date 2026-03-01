import { useState, useEffect, useMemo } from "react";
import { getCrag, getRoutesByCrag } from "@/lib/api";
import type { Crag, Route } from "@/types/api";

/**
 * A custom hook for the crag detail page.
 * Handles fetching crag and route data, and provides filtering logic for routes.
 * 
 * @param id The crag ID.
 */
export function useCrag(id: string) {
  const [crag, setCrag] = useState<Crag | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [cragData, routesData] = await Promise.all([
          getCrag(id),
          getRoutesByCrag(id)
        ]);
        setCrag(cragData);
        setRoutes(routesData);
      } catch (err) {
        console.error("Failed to load crag data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [routes, searchQuery]);

  return {
    crag,
    routes,
    filteredRoutes,
    loading,
    searchQuery,
    setSearchQuery
  };
}
