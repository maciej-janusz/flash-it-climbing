async function getHealth(): Promise<{ status: string }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });

  if (!res.ok) {
    return { status: "unhealthy" };
  }

  return res.json();
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Flash It</h1>
        <p className="text-sm text-slate-400">
          FastAPI + Next.js 14 + MongoDB boilerplate
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="mb-2 text-sm font-medium text-slate-300">
          API health check
        </h2>
        <p className="text-sm">
          Status:{" "}
          <span
            className={
              health.status === "ok" ? "text-emerald-400" : "text-red-400"
            }
          >
            {health.status}
          </span>
        </p>
      </section>

      <section className="mt-auto text-xs text-slate-500">
        <p>Run stack with: docker compose up --build</p>
      </section>
    </div>
  );
}

