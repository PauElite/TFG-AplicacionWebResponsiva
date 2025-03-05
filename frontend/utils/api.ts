import axios from "axios";

const API_URL = "http://localhost:3000/recetas/users";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permitir cookies y credenciales
});

// Función para obtener el token de acceso desde localStorage
const getAuthToken = () => localStorage.getItem("accessToken");

// Interceptor para adjuntar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
