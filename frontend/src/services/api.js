import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT automatically to protected requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cineflow_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function checkApiHealth() {
  return api.get("/health");
}

export default api;