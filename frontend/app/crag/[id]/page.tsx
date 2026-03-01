"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCrag } from "@/hooks/useCrag";
import { CragHeader } from "@/components/crag/CragHeader";
import { RouteSearch } from "@/components/crag/RouteSearch";
import { RouteList } from "@/components/crag/RouteList";

export default function CragDetailPage() {
  const { id } = useParams() as { id: string };
  const {
    crag,
    routes,
    filteredRoutes,
    loading,
    searchQuery,
    setSearchQuery
  } = useCrag(id);

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
        <CragHeader crag={crag} />

        {/* Routes List Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              Dostępne drogi <span className="text-flash-text-muted text-lg">({routes.length})</span>
            </h2>
            
            <RouteSearch 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
          </div>

          <RouteList routes={filteredRoutes} />
        </div>
      </div>
    </div>
  );
}

