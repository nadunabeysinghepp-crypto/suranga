const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function api(path, options = {}) {
  if (!path) {
    throw new Error("❌ API path is required");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
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
