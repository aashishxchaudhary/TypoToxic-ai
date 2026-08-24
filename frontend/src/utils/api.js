import { storage } from "./storage";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = async (path, options = {}) => {
  const token = storage.getToken();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};
