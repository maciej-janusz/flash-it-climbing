import Link from "next/link";
import type { Crag } from "@/types/api";

interface CragHeaderProps {
  crag: Crag;
}

/**
 * Component displaying the header section of a crag detail page.
 */
export function CragHeader({ crag }: CragHeaderProps) {
  return (
    <div className="glass-card p-10 md:p-12 rounded-[3rem] relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-black text-flash-text-muted tracking-widest">
              {crag.country_name.toUpperCase()}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-black text-flash-text-muted tracking-widest">
              {crag.area.toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            {crag.name}
          </h1>
        </div>
        
        <Link 
          href="/add-route" 
          className="bg-flash-primary text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-flash-primary/20 whitespace-nowrap text-center"
        >
          + Dodaj drogę tutaj
        </Link>
      </div>
      
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-flash-primary/10 rounded-full blur-3xl" />
    </div>
  );
}
