// API client for authentication and user management

const API_BASE = "/api/auth";

export const authApi = {
  async register({ username, email, password }) {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed.");
    }
    return data;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed.");
    }
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user profile.");
    }
    return data;
  },
};
