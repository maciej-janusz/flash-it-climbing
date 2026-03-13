"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mountain, Rocket, ArrowLeft } from "lucide-react";
import { getCountries, createCrag } from "@/lib/api";
import type { Country, CreateCragRequest } from "@/types/api";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { CragForm } from "@/components/forms/CragForm";
import { useToast } from "@/hooks/useToast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function AddCragPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cragData, setCragData] = useState<CreateCragRequest>({ 
    name: "", 
    area: "", 
    country_id: "" 
  });

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Validation
  const isNameValid = (name: string) => name.trim().length >= 2;
  const isAreaValid = (area: string) => area.trim().length >= 2;
  const isCountryValid = (id: string) => id !== "";

  const canSubmit = isNameValid(cragData.name) && 
                    isAreaValid(cragData.area) && 
                    isCountryValid(cragData.country_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!canSubmit) {
      toast.error("Proszę poprawnie wypełnić wszystkie pola.");
      return;
    }

    setLoading(true);

    try {
      const res = await createCrag(cragData);

      if (res.success) {
        toast.success("Nowy rejon został utworzony pomyślnie!");
        router.push("/explore");
      } else {
        toast.error(res.error || "Błąd podczas tworzenia rejonu.");
      }
    } catch (error: any) {
      toast.error("Wystąpił nieoczekiwany błąd.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
        <Link 
          href="/explore" 
          className="inline-flex items-center gap-2 text-flash-text-muted hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Powrót do eksploracji
        </Link>

        <header className="animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Dodaj nowy rejon</h1>
          <p className="text-flash-text-muted font-medium">Uzupełnij bazę o nowe miejsce wspinaczkowe.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <GlassCard title="Szczegóły rejonu" icon={<Mountain className="w-5 h-5" />}>
            <div className="space-y-4">
              <CragForm countries={countries} onChange={setCragData} />
            </div>
          </GlassCard>

          <Button 
            type="submit" 
            loading={loading} 
            disabled={!canSubmit || loading}
            className="w-full py-6 text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-6 h-6" /> Utwórz rejon
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
