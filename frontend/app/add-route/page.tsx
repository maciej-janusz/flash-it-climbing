"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCountries, createCrag, createRoute } from "@/lib/api";
import type { Crag, Country, RouteType } from "@/types/api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GlassCard } from "@/components/ui/GlassCard";
import { CragSelector } from "@/components/CragSelector";
import { CragForm } from "@/components/forms/CragForm";
import { useToast } from "@/hooks/useToast";

export default function AddRoutePage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  
  // States
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("6a");
  const [type, setType] = useState<RouteType>("lead");
  const [selectedCrag, setSelectedCrag] = useState<Crag | null>(null);
  const [isAddingNewCrag, setIsAddingNewCrag] = useState(false);
  const [newCragData, setNewCragData] = useState({ name: "", area: "", country_id: "" });

  const grades = ["6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9c"];

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let cragId = selectedCrag?.id || "";

      if (isAddingNewCrag) {
        const cragRes = await createCrag(newCragData);
        if (cragRes.success && cragRes.id) {
          cragId = cragRes.id;
          toast.success("Nowy rejon został utworzony!");
        } else {
          toast.error(cragRes.error || "Błąd podczas tworzenia rejonu.");
          setLoading(false);
          return;
        }
      }

      if (!cragId) {
        toast.error("Proszę wybrać lub dodać rejon.");
        setLoading(false);
        return;
      }

      const routeRes = await createRoute({ name, grade, type, crag_id: cragId });

      if (routeRes.success) {
        toast.success("Droga została dodana pomyślnie!");
        router.push("/");
      } else {
        toast.error(routeRes.error || "Błąd podczas tworzenia drogi.");
      }
    } catch (error: any) {
      toast.error("Wystąpił nieoczekiwany błąd.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="animate-fade-in text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Dodaj nową drogę</h1>
        <p className="text-flash-text-muted font-medium">Podziel się nowym przejściem ze społecznością.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <GlassCard title="Szczegóły drogi" icon="🧗">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              required
              label="Nazwa drogi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Mandatory Delight"
            />
            <Select
              label="Wycena"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={grades.map(g => ({ value: g, label: g }))}
            />
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-flash-text-muted uppercase tracking-widest ml-1">Typ</label>
              <div className="flex bg-white/5 p-1 rounded-[1.25rem] border border-white/5">
                {(["lead", "boulder"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                      type === t 
                        ? "bg-flash-primary text-black shadow-lg shadow-flash-primary/20" 
                        : "text-flash-text-muted hover:text-white"
                    }`}
                  >
                    {t === "lead" ? "Lina" : "Bulder"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Rejon wspinaczkowy" icon="🏔️">
          <div className="space-y-6">
            <CragSelector 
              selectedCrag={selectedCrag} 
              onSelect={setSelectedCrag} 
              disabled={isAddingNewCrag}
            />

            {!selectedCrag && (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black text-flash-text-disabled uppercase tracking-[0.3em]">lub</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <Button
                  type="button"
                  variant={isAddingNewCrag ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => setIsAddingNewCrag(!isAddingNewCrag)}
                >
                  {isAddingNewCrag ? "✕ Anuluj dodawanie rejonu" : "➕ Dodaj nowy rejon"}
                </Button>
              </>
            )}

            {isAddingNewCrag && !selectedCrag && (
              <CragForm countries={countries} onChange={setNewCragData} />
            )}
          </div>
        </GlassCard>

        <Button type="submit" loading={loading} className="w-full py-6 text-lg">
          🚀 Opublikuj drogę
        </Button>
      </form>
    </div>
  );
}
