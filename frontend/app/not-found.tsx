import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-black text-white mb-4">404</h1>
      <p className="text-xl text-flash-text-muted mb-8">Nie znaleźliśmy Twojej drogi...</p>
      <Link 
        href="/" 
        className="bg-flash-primary text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-flash-primary/20"
      >
        Wróć do bazy
      </Link>
    </div>
  );
}
