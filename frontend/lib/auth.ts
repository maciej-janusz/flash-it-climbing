import { User, LoginRequest, RegisterRequest } from "@/types/api";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const authService = {
  async login(credentials: LoginRequest): Promise<string> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const res = await fetch(`${BASE}/auth/jwt/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  },

  async register(data: RegisterRequest): Promise<void> {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Registration failed");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;

    try {
      const res = await fetch(`${BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        return null;
      }

      return await res.json();
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
};
