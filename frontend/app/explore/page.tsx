"use client";

import { useExplore } from "@/hooks/useExplore";
import { Select } from "@/components/ui/Select";
import { GlassCard } from "@/components/ui/GlassCard";
import { CragSelector } from "@/components/CragSelector";
import { PopularRegions } from "@/components/explore/PopularRegions";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ExploreCragsPage() {
  const {
    countries,
    selectedCountryId,
    setSelectedCountryId,
    setSelectedCrag
  } = useExplore();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16">
      <header className="animate-fade-in text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
          Odkrywaj <span className="text-flash-primary underline decoration-white/10">Świat</span>
        </h1>
        <p className="text-flash-text-muted text-lg font-medium max-w-xl mx-auto">
          Wybierz kraj i wyszukaj rejon wspinaczkowy, aby zobaczyć dostępne drogi.
        </p>
      </header>

      <GlassCard className="md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -z-10 bg-flash-primary/5 blur-3xl w-64 h-64 rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Select
            label="Kraj"
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            options={[
              { value: "", label: "Wszystkie kraje" },
              ...countries.map(c => ({ value: c.id, label: c.name }))
            ]}
          />

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-flash-text-muted uppercase tracking-widest ml-1">
              Szukaj Rejonu
            </label>
            <CragSelector 
              selectedCrag={null} 
              onSelect={setSelectedCrag} 
              countryId={selectedCountryId}
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-flash-text-disabled uppercase tracking-widest">
            Nie możesz znaleźć rejonu?
          </p>
          <Link 
            href="/add-route" 
            className="text-flash-primary font-black text-sm uppercase tracking-tighter hover:scale-105 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Dodaj nowy rejon / drogę
          </Link>
        </div>
      </GlassCard>

      <PopularRegions />
    </div>
  );
}

