import axios from "axios";

const RECIPES_API_URL = "http://localhost:3002/recetas"; // URL de tu backend de recetas

const apiRecipeInstance = axios.create({
  baseURL: RECIPES_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Función para obtener el token de acceso
const getAuthToken = () => localStorage.getItem("accessToken");

// Interceptor para adjuntar el token en cada petición
apiRecipeInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para configurar interceptores de respuesta
export const setupRecipeInterceptors = (logout: () => void) => {
  apiRecipeInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          console.log("🔄 Intentando renovar token...");
          if (!refreshToken) throw new Error("No hay token de refresco");

          // Usamos la instancia de usuarios para renovar el token
          const { data } = await axios.post("http://localhost:3001/recetas/users/refresh", { 
            refreshToken 
          });

          console.log("✅ Nuevo token recibido:", data.tokenAcceso);
          localStorage.setItem("accessToken", data.tokenAcceso);

          originalRequest.headers = originalRequest.headers || {}; // Asegurar que headers no es undefined
          originalRequest.headers.Authorization = `Bearer ${data.tokenAcceso}`;
          
          return apiRecipeInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          console.error("Error al renovar token:", refreshError);
          logout();
          
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
};

export const apiRecipe = apiRecipeInstance;