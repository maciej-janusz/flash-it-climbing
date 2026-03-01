interface RouteSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * A search input component specifically for filtering routes in a crag.
 */
export function RouteSearch({ value, onChange }: RouteSearchProps) {
  return (
    <div className="relative group max-w-sm w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-flash-text-disabled group-focus-within:text-flash-primary transition-colors">
        🔍
      </span>
      <input
        type="text"
        placeholder="Szukaj drogi w rejonie..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3 focus:ring-2 focus:ring-flash-primary/40 focus:border-flash-primary/40 outline-none transition-all text-white placeholder:text-flash-text-disabled"
      />
    </div>
  );
}
