import axios from "axios";

// ✅ Asegurar que la API apunta al backend correcto
const API_URL = "http://localhost:3000/recetas/users"; // Asegúrate de que coincida con el prefijo de tus rutas

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/register`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Permitir autenticación con cookies si el backend lo requiere
  });
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

export const logoutUser = async () => {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/perfil`, { withCredentials: true });
  return response.data;
};
