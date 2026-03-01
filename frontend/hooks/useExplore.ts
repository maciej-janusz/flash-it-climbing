import { useState, useEffect } from "react";
import { getCountries } from "@/lib/api";
import type { Country, Crag } from "@/types/api";
import { useRouter } from "next/navigation";

/**
 * A custom hook for the explore page.
 * Handles fetching countries, managing selected country and crag,
 * and performing navigation to crag details.
 */
export function useExplore() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCrag, setSelectedCrag] = useState<Crag | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (selectedCrag) {
      router.push(`/crag/${selectedCrag.id}`);
    }
  }, [selectedCrag, router]);

  return {
    countries,
    selectedCountryId,
    setSelectedCountryId,
    selectedCrag,
    setSelectedCrag
  };
}
