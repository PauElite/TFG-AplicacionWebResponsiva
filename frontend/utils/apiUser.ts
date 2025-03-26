import axios from "axios";

const USERS_API_URL = "http://localhost:3001/recetas/users";

export const apiUser = axios.create({
  baseURL: USERS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permitir cookies y credenciales
});

// Función para obtener el token de acceso desde localStorage
const getAuthToken = () => localStorage.getItem("accessToken");

// Interceptor para adjuntar el token en cada petición
apiUser.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {}; // Asegurar que headers no es undefined
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para configurar la instancia de Axios con el logout del contexto
export const setupUserInterceptors = (logout: () => void) => {
  apiUser.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, devolverla tal cual
    async (error) => {
      const originalRequest = error.config;

      // Si el token ha expirado y la petición aún no se ha reintentado
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Obtener el token de refresco de localStorage
          const refreshToken = localStorage.getItem("refreshToken");
          console.log("🔄 Intentando renovar token...");

          if (!refreshToken) throw new Error("No hay token de refresco");

          // Enviar petición para renovar el token
          const { data } = await apiUser.post("/refresh", { refreshToken });
          console.log("✅ Nuevo token recibido:", data.tokenAcceso);

          // Guardar el nuevo token de acceso
          localStorage.setItem("accessToken", data.tokenAcceso);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers = originalRequest.headers || {}; // Asegurar que headers no es undefined
          originalRequest.headers["Authorization"] = `Bearer ${data.tokenAcceso}`;

          return apiUser(originalRequest);
        } catch (refreshError) {
          console.error("❌ Error al renovar el token:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          
          // Llamar a la función logout pasada desde el contexto
          logout();
          
          window.location.href = "/login"; // Redirigir al login si la renovación falla
        }
      }

      return Promise.reject(error);
    }
  );
};
