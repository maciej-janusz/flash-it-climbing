"use client";

import { useState } from "react";
import type { Country } from "@/types/api";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface CragFormProps {
  countries: Country[];
  onChange: (data: { name: string; area: string; country_id: string }) => void;
}

export function CragForm({ countries, onChange }: CragFormProps) {
  const [data, setData] = useState({ name: "", area: "", country_id: "" });

  const handleChange = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange(newData);
  };

  const isNameValid = (name: string) => name.trim().length >= 2;
  const isAreaValid = (area: string) => area.trim().length >= 2;
  const isCountryValid = (id: string) => id !== "";

  return (
    <div className="space-y-6 pt-6 border-t border-white/5 mt-4 animate-slide-down">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Input
            required
            label="Nazwa sektora (Name)"
            placeholder="np. Podzamcze"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={data.name && !isNameValid(data.name) ? "Min. 2 znaki" : undefined}
          />
        </div>

        <div className="space-y-1">
          <Input
            required
            label="Rejon / Region (Area)"
            placeholder="np. Jura Północna"
            value={data.area}
            onChange={(e) => handleChange("area", e.target.value)}
            error={data.area && !isAreaValid(data.area) ? "Min. 2 znaki" : undefined}
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <Select
            required
            label="Kraj"
            value={data.country_id}
            onChange={(e) => handleChange("country_id", e.target.value)}
            options={[
              { value: "", label: "Wybierz kraj..." },
              ...countries.map(c => ({ value: c.id, label: c.name }))
            ]}
            error={!isCountryValid(data.country_id) ? "Wymagane wybranie kraju" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
