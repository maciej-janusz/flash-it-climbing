"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { searchRoutes, searchCrags } from "@/lib/api";
import type { Route, Crag } from "@/types/api";
import { Input } from "./ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

type Tab = "routes" | "crags";

/**
 * A search bar component with tab switching (routes/crags) and debounced search functionality.
 */
export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, query, setQuery] = useDebounce("", 300);
  const [tab, setTab] = useState<Tab>("routes");
  const [results, setResults] = useState<Route[] | Crag[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function performSearch() {
      const q = debouncedQuery.trim();
      if (q.length < 2) {
        setResults([]);
        setSearched(false);
        return;
      }
      
      setLoading(true);
      setSearched(true);
      try {
        if (tab === "routes") {
          const data = await searchRoutes(q);
          setResults(data);
        } else {
          const data = await searchCrags(q);
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery, tab]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={panelRef} className="relative flex-1 max-w-xl">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left text-sm text-flash-text-muted transition hover:bg-white/10"
        >
          <Search className="w-4 h-4 text-flash-primary" />
          Szukaj dróg i rejonów...
        </button>
      ) : (
        <div className="absolute left-0 right-0 top-0 z-50 rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl animate-slide-down overflow-hidden">
          <div className="p-4 bg-white/5">
            <div className="flex flex-col gap-4">
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                {(["routes", "crags"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                      tab === t 
                        ? "bg-flash-primary text-black shadow-lg shadow-flash-primary/20" 
                        : "text-flash-text-muted hover:text-white"
                    }`}
                  >
                    {t === "routes" ? "Drogi" : "Rejony"}
                  </button>
                ))}
              </div>
              <Input
                autoFocus
                icon={<Search className="w-4 h-4" />}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "routes" ? "Wpisz nazwę drogi..." : "Wpisz nazwę rejonu..."}
              />
            </div>
          </div>

          {searched && (
            <div className="max-h-[350px] overflow-y-auto border-t border-white/5 p-2 bg-[#0d0d0d]">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                   <div className="w-6 h-6 border-2 border-flash-primary border-t-transparent rounded-full animate-spin" />
                   <p className="text-[10px] font-black text-flash-text-disabled uppercase tracking-[0.3em]">Przeszukiwanie</p>
                </div>
              ) : (
                <ul className="space-y-1 z-30">
                  {results.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm font-bold text-flash-text-disabled uppercase tracking-widest opacity-50">
                        Brak wyników dla „{debouncedQuery.trim()}"
                      </p>
                    </div>
                  ) : tab === "routes" ? (
                    (results as Route[]).map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/route/${r.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/5 group"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-flash-primary transition-colors">
                              {r.name}
                            </span>
                            <span className="text-[10px] font-black text-flash-text-muted uppercase tracking-widest opacity-60 mt-0.5">
                              {r.crag_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-sm text-flash-primary drop-shadow-glow">
                              {r.grade}
                            </span>
                            <ArrowRight className="w-4 h-4 text-flash-text-disabled group-hover:text-flash-primary transition-colors transform group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    (results as Crag[]).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/crag/${c.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/5 group"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-flash-primary transition-colors">
                              {c.name}
                            </span>
                            <span className="text-[10px] font-black text-flash-text-muted uppercase tracking-widest opacity-60 mt-0.5">
                              {c.area} · {c.country_name}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-flash-text-disabled group-hover:text-flash-primary transition-colors transform group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

