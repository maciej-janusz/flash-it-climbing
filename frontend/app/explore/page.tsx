"use client";

import { useEffect, useState } from "react";
import { getCountries } from "@/lib/api";
import type { Crag, Country } from "@/types/api";

import { Select } from "@/components/ui/Select";
import { GlassCard } from "@/components/ui/GlassCard";
import { CragSelector } from "@/components/CragSelector";
import Link from "next/link";

export default function ExploreCragsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCrag, setSelectedCrag] = useState<Crag | null>(null);

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Redirect to crag detail if one is selected via selector
  useEffect(() => {
    if (selectedCrag) {
      window.location.href = `/crag/${selectedCrag.id}`;
    }
  }, [selectedCrag]);

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
            <label className="text-xs font-black text-flash-text-muted uppercase tracking-widest ml-1">Szukaj Rejonu</label>
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
          <Link href="/add-route" className="text-flash-primary font-black text-sm uppercase tracking-tighter hover:scale-105 transition-all">
            + Dodaj nowy rejon / drogę
          </Link>
        </div>
      </GlassCard>

      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-2xl font-black text-white mb-8 px-2 tracking-tight">Popularne Rejony</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Siurana", "Ceuse", "Jura Północna"].map((name) => (
            <div key={name} className="glass-card p-6 rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group">
               <div className="w-full h-32 bg-white/5 rounded-2xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-flash-primary/10 to-transparent" />
               </div>
               <h4 className="font-bold text-xl text-white group-hover:text-flash-primary transition-colors">{name}</h4>
               <p className="text-flash-text-muted text-sm mt-1">Odkryj drogi w tym rejonie</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
