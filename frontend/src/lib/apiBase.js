const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function api(path, options = {}) {
  if (!path) throw new Error("API path is required");

  const safePath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${safePath}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}
