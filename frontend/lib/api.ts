import type { Route, Crag, CreateRouteRequest, CreateCragRequest, Country } from "@/types/api";

const BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000")
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function api(path: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "Unknown error";
    try {
      const errorData = await res.json();
      
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((err: any) => {
            if (typeof err === "string") return err;
            const locStr = Array.isArray(err.loc) ? err.loc.join(".") : "error";
            const msgStr = typeof err.msg === "string" ? err.msg : JSON.stringify(err);
            return `${locStr}: ${msgStr}`;
          })
          .join(", ");
      } else if (errorData.detail && typeof errorData.detail === "object") {
        errorMessage = errorData.detail.message || errorData.detail.msg || JSON.stringify(errorData.detail);
      } else {
        errorMessage = errorData.message || res.statusText;
      }
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

/**
 * Fetches a single route by its ID.
 * @param id The route ID.
 * @returns The route object or null if not found.
 */
export async function getRoute(id: string): Promise<Route | null> {
  try {
    const res = await api(`/v1/routebase/route/${id}`);
    const data = await res.json();
    return normalizeId(data);
  } catch { return null; }
}

/**
 * Fetches a single crag by its ID.
 * @param id The crag ID.
 * @returns The crag object or null if not found.
 */
export async function getCrag(id: string): Promise<Crag | null> {
  try {
    const res = await api(`/v1/routebase/crag/${id}`);
    const data = await res.json();
    return normalizeId(data);
  } catch { return null; }
}

/**
 * Fetches all routes associated with a specific crag.
 * @param cragId The crag ID.
 * @returns An array of routes.
 */
export async function getRoutesByCrag(cragId: string): Promise<Route[]> {
  try {
    const res = await api(`/v1/routebase/routes/${cragId}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Route>(item)) : [];
  } catch { return []; }
}

/**
 * Searches for routes based on a query string.
 * @param query The search query.
 * @param page The results page number (default: 1).
 * @returns An array of matching routes.
 */
export async function searchRoutes(query: string, page = 1): Promise<Route[]> {
  try {
    const params = new URLSearchParams({ query, page: String(page) });
    const res = await api(`/v1/routebase/search/route?${params}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Route>(item)) : [];
  } catch { return []; }
}

/**
 * Searches for crags based on a query string and optional country filter.
 * @param query The search query.
 * @param countryId Optional country filter ID.
 * @param page The results page number (default: 1).
 * @returns An array of matching crags.
 */
export async function searchCrags(query: string, countryId?: string, page = 1): Promise<Crag[]> {
  try {
    const params = new URLSearchParams({ query, page: String(page) });
    if (countryId) params.append("country_id", countryId);
    const res = await api(`/v1/routebase/search/crag?${params}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(item => normalizeId<Crag>(item)) : [];
  } catch { return []; }
}

/**
 * Fetches a list of all countries.
 * @returns An array of country objects.
 */
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

/**
 * Creates a new route.
 * @param route The route creation request payload.
 * @returns An object indicating success, the new route ID, or an error message.
 */
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

/**
 * Creates a new crag.
 * @param crag The crag creation request payload.
 * @returns An object indicating success, the new crag ID, or an error message.
 */
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

