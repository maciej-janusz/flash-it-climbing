import Link from "next/link";
import { Plus, Mountain, MapPin } from "lucide-react";
import { FeatureCard } from "@/components/home/FeatureCard";

export default function HomePage() {
  const features = [
    { title: "Niesamowite Rejony", desc: "Tysiące zweryfikowanych miejsc wspinaczkowych.", icon: <Mountain className="w-8 h-8 text-flash-primary" /> },
    { title: "Precyzyjne Mapy", desc: "Zawsze trafisz pod właściwy sektor.", icon: <MapPin className="w-8 h-8 text-flash-primary" /> },
    { title: "Społeczność", desc: "Dziel się z innymi swoimi przejściami.", icon: <Mountain className="w-8 h-8 text-flash-primary" /> }
  ];

  return (
    <div className="flex flex-1 flex-col gap-12">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-flash-bg-secondary to-flash-bg p-8 md:p-16 border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-flash-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-80 h-80 bg-accent/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Twoja kolejna <span className="text-flash-primary text-glow">życiówka</span> zaczyna się tutaj.
          </h1>
          <p className="text-lg md:text-xl text-flash-text-muted mb-8 leading-relaxed">
            Odkrywaj najlepsze drogi wspinaczkowe, planuj wyjazdy i śledź swoje postępy w nowoczesnym stylu.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/add-route" className="px-8 py-4 bg-flash-primary hover:bg-flash-primary-hover text-black font-bold rounded-2xl transition-all shadow-lg shadow-flash-primary/20 active:scale-95 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Dodaj nową drogę
            </Link>
            <Link href="/explore" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all active:scale-95">
              Przeglądaj rejony
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, i) => (
          <FeatureCard 
            key={i}
            title={item.title}
            desc={item.desc}
            icon={item.icon}
            delay={(i + 1) * 100}
          />
        ))}
      </div>
    </div>
  );
}

