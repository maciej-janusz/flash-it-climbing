import type { Route, Crag, CreateRouteRequest, CreateCragRequest, Country } from "@/types/api";

const BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000")
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = "Unknown error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || res.statusText;
    } catch {
      errorMessage = res.statusText;
    }
    throw new Error(errorMessage);
  }
  return res;
}

function normalizeId<T>(item: any): T & { id: string } {
  if (!item) return item;
  return { ...item, id: (item.id ?? item._id ?? "").toString() } as T & { id: string };
}

export async function getRoute(id: string): Promise<Route | null> {
  try {
    const res = await api(`/v1/routebase/route/${id}`);
    const data = await res.json();
    return normalizeId(data);
  } catch { return null; }
}

export async function getCrag(id: string): Promise<Crag | null> {
  try {
    const res = await api(`/v1/routebase/crag/${id}`);
    const data = await res.json();
    return normalizeId(data);
  } catch { return null; }
}

export async function getRoutesByCrag(cragId: string): Promise<Route[]> {
  try {
    const res = await api(`/v1/routebase/routes/${cragId}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Route>(item)) : [];
  } catch { return []; }
}

export async function searchRoutes(query: string, page = 1): Promise<Route[]> {
  try {
    const params = new URLSearchParams({ query, page: String(page) });
    const res = await api(`/v1/routebase/search/route?${params}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Route>(item)) : [];
  } catch { return []; }
}

export async function searchCrags(query: string, countryId?: string, page = 1): Promise<Crag[]> {
  try {
    const params = new URLSearchParams({ query, page: String(page) });
    if (countryId) params.append("country_id", countryId);
    const res = await api(`/v1/routebase/search/crag?${params}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Crag>(item)) : [];
  } catch { return []; }
}

export async function getCountries(): Promise<Country[]> {
  try {
    const res = await api(`/v1/routebase/countries`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      id: (item.id ?? item._id ?? "").toString(),
      name: item.name || "Unknown"
    }));
  } catch (err) {
    console.error("Error in getCountries:", err);
    return [];
  }
}

export async function createRoute(route: CreateRouteRequest): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await api(`/v1/routebase/route`, {
      method: "POST",
      body: JSON.stringify(route),
    });
    const data = await res.json();
    return { success: true, id: data.id ?? data._id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createCrag(crag: CreateCragRequest): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await api(`/v1/routebase/crag`, {
      method: "POST",
      body: JSON.stringify(crag),
    });
    const data = await res.json();
    return { success: true, id: data.id ?? data._id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
