"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getRoute } from "@/lib/api";
import type { Route } from "@/types/api";

export default function RouteDetailPage() {
  const { id } = useParams() as { id: string };
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoute() {
      const data = await getRoute(id);
      setRoute(data);
      setLoading(false);
    }
    loadRoute();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-flash-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-flash-text-muted font-bold animate-pulse">Ładowanie drogi...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-flash-text-muted mb-8">Nie znaleźliśmy takiej drogi.</p>
        <Link href="/" className="px-8 py-3 bg-flash-primary text-black font-bold rounded-2xl hover:scale-105 transition-all">
          Wróć do strony głównej
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/" className="inline-flex items-center gap-2 text-flash-text-muted hover:text-flash-primary transition-colors mb-8 font-bold group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Powrót
      </Link>

      <div className="animate-fade-in space-y-8">
        {/* Hero Section */}
        <div className="relative glass-card p-10 md:p-16 rounded-[3rem] overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className={`px-6 py-2 rounded-full font-black text-lg shadow-xl ${route.type === "boulder" ? "bg-accent text-white shadow-accent/20" : "bg-flash-primary text-black shadow-flash-primary/20"}`}>
              {route.type === "boulder" ? "BULDER" : "LINA"}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              {route.name}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-flash-primary drop-shadow-glow">
                {route.grade}
              </span>
              <div className="h-8 w-[2px] bg-white/10 hidden md:block" />
              <Link href={`/crag/${route.crag_id}`} className="text-2xl md:text-3xl font-bold text-white/60 hover:text-white transition-colors">
                {route.crag_name}
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-flash-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
           <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-center">
              <h3 className="text-flash-text-muted uppercase tracking-widest text-xs font-black mb-2">Typ Przejścia</h3>
              <p className="text-2xl font-bold text-white">
                {route.type === "lead" ? "Wspinaczka z liną (Lead Climbing)" : "Buldering (Bouldering)"}
              </p>
           </div>
           <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-center">
              <h3 className="text-flash-text-muted uppercase tracking-widest text-xs font-black mb-2">Lokalizacja</h3>
              <p className="text-2xl font-bold text-white">{route.crag_name}</p>
              <Link href={`/crag/${route.crag_id}`} className="text-flash-primary font-bold text-sm mt-2 hover:underline">
                Zobacz wszystkie drogi w tym rejonie →
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
