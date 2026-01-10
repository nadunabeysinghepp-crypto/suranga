// src/lib/apiBase.js

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

/**
 * Generic API helper
 */
export async function api(path, options = {}) {
  if (!path) {
    throw new Error("API path is required");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}

/**
 * ✅ DEFAULT EXPORT (THIS FIXES YOUR BUILD)
 */
export default API_BASE;
