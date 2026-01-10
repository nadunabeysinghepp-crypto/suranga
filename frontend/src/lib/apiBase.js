// src/lib/apiBase.js

/**
 * API BASE URL
 * Priority:
 * 1. VITE_API_URL from environment (production)
 * 2. http://localhost:5000 (development fallback)
 */
const API_BASE =
  (import.meta.env.VITE_API_URL &&
    import.meta.env.VITE_API_URL.replace(/\/$/, "")) ||
  "http://localhost:5000";

export default API_BASE;

/**
 * Generic API helper
 * @param {string} path - API path (example: "/api/portfolio")
 * @param {object} options - fetch options
 */
export async function api(path, options = {}) {
  if (!path) {
    throw new Error("❌ API path is required");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // safe even if not using cookies
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    let message = "API request failed";
    try {
      const text = await res.text();
      message = text || message;
    } catch (_) {}
    throw new Error(message);
  }

  // Handle empty responses safely
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}
