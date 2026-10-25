export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function apiUrl(resource: string, id?: string) {
  const base = `${API_BASE_URL}/${resource}`;
  return id === undefined ? base : `${base}/${encodeURIComponent(id)}`;
}
