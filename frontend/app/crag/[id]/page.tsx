"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCrag, getRoutesByCrag } from "@/lib/api";
import type { Crag, Route } from "@/types/api";

export default function CragDetailPage() {
  const { id } = useParams() as { id: string };
  const [crag, setCrag] = useState<Crag | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      const [cragData, routesData] = await Promise.all([
        getCrag(id),
        getRoutesByCrag(id)
      ]);
      setCrag(cragData);
      setRoutes(routesData);
      setLoading(false);
    }
    loadData();
  }, [id]);

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-flash-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-flash-text-muted font-bold">Ładowanie rejonu...</p>
      </div>
    );
  }

  if (!crag) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-flash-text-muted">Nie znaleźliśmy takiego rejonu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Link href="/" className="inline-flex items-center gap-2 text-flash-text-muted hover:text-flash-primary transition-colors mb-8 font-bold group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Powrót 
      </Link>

      <div className="animate-fade-in space-y-12">
        {/* Crag Header */}
        <div className="glass-card p-10 md:p-12 rounded-[3rem] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-black text-flash-text-muted tracking-widest">
                  {crag.country_name.toUpperCase()}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs font-black text-flash-text-muted tracking-widest">
                  {crag.area.toUpperCase()}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                {crag.name}
              </h1>
            </div>
            
            <Link 
              href="/add-route" 
              className="bg-flash-primary text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-flash-primary/20 whitespace-nowrap text-center"
            >
              + Dodaj drogę tutaj
            </Link>
          </div>
          
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-flash-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Routes List Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              Dostępne drogi <span className="text-flash-text-muted text-lg">({routes.length})</span>
            </h2>
            
            <div className="relative group max-w-sm w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-flash-text-disabled group-focus-within:text-flash-primary transition-colors">🔍</span>
              <input
                type="text"
                placeholder="Szukaj drogi w rejonie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3 focus:ring-2 focus:ring-flash-primary/40 focus:border-flash-primary/40 outline-none transition-all text-white placeholder:text-flash-text-disabled"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <Link 
                  key={route.id} 
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
              ))
            ) : (
              <div className="md:col-span-2 text-center py-12 glass-card rounded-2xl border-dashed">
                <p className="text-flash-text-disabled font-bold">Brak dróg spełniających kryteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
