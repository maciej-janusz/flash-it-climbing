interface PopularRegion {
  name: string;
}

/**
 * A component that displays a grid of popular climbing regions.
 */
export function PopularRegions() {
  const regions: PopularRegion[] = [
    { name: "Siurana" },
    { name: "Ceuse" },
    { name: "Jura Północna" }
  ];

  return (
    <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-2xl font-black text-white mb-8 px-2 tracking-tight">Popularne Rejony</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <div 
            key={region.name} 
            className="glass-card p-6 rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
             <div className="w-full h-32 bg-white/5 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-flash-primary/10 to-transparent" />
             </div>
             <h4 className="font-bold text-xl text-white group-hover:text-flash-primary transition-colors">
               {region.name}
             </h4>
             <p className="text-flash-text-muted text-sm mt-1">Odkryj drogi w tym rejonie</p>
          </div>
        ))}
      </div>
    </section>
  );
}
