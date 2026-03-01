import { User, LoginRequest, RegisterRequest } from "@/types/api";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const authService = {
  /**
   * Logs in a user with the provided credentials and stores the token in localStorage.
   * @param credentials The login credentials (username and password).
   * @returns The access token.
   */
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

  /**
   * Registers a new user.
   * @param data The registration data.
   */
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

  /**
   * Fetches the current authenticated user's profile.
   * @returns The user object or null if not authenticated.
   */
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

  /**
   * Logs out the current user by removing the token from localStorage.
   */
  logout() {
    localStorage.removeItem("token");
  },

  /**
   * Retrieves the current authentication token from localStorage.
   * @returns The token or null if not available.
   */
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
};

