"use client";

import { useState, useEffect, useRef } from "react";
import { searchCrags } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import type { Crag } from "@/types/api";
import { Search } from "lucide-react";
import { Input } from "../ui/Input";

interface CragSelectorProps {
  selectedCrag: Crag | null;
  onSelect: (crag: Crag | null) => void;
  disabled?: boolean;
  countryId?: string;
}

export function CragSelector({ selectedCrag, onSelect, disabled, countryId }: CragSelectorProps) {
  const [debouncedQuery, query, setQuery] = useDebounce("", 300);
  const [results, setResults] = useState<Crag[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length >= 2 && !selectedCrag) {
        setLoading(true);
        try {
          const data = await searchCrags(debouncedQuery, countryId);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Failed to fetch crags:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }
    fetchResults();
  }, [debouncedQuery, selectedCrag, countryId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (selectedCrag) {
    return (
      <div className="flex items-center justify-between bg-flash-primary/10 border border-flash-primary/30 rounded-2xl px-5 py-4 animate-slide-up">
        <div className="flex flex-col">
          <span className="font-bold text-flash-primary">{selectedCrag.name}</span>
          <span className="text-xs text-flash-text-muted">— {selectedCrag.area}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            setQuery("");
          }}
          className="text-flash-primary hover:text-flash-primary-hover font-black text-xs uppercase tracking-widest"
        >
          Zmień
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <Input
        icon={<Search className="w-4 h-4" />}
        placeholder="Wyszukaj rejon (min. 2 znaki)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
      />
      
      {loading && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-flash-primary border-t-transparent rounded-full animate-spin" />
      )}
      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-30 w-full mt-2 glass rounded-2xl border border-white/10 p-8 text-center text-flash-text-muted">
          Nie znaleziono rejonu...
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div className="absolute z-30 w-full mt-2 glass rounded-2xl border border-white/10 shadow-2xl max-h-60 overflow-y-auto scrollbar-hide animate-slide-down">
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelect(c);
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-4 hover:bg-white/5 border-b border-white/5 last:border-none transition-all group"
            >
              <div className="font-bold text-white group-hover:text-flash-primary transition-colors">{c.name}</div>
              <div className="text-xs text-flash-text-muted">{c.area} · {c.country_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
