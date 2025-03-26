"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiUser, setupUserInterceptors } from "../utils/apiUser";
import { jwtDecode } from "jwt-decode";
import { setupRecipeInterceptors } from "@/utils/apiRecipe";

interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  refreshToken: string | null;
  createdAt: string;
}


interface AuthContextType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  isTokenValid: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setupUserInterceptors(logout);
    setupRecipeInterceptors(logout);
  }, []);


  const register = async (name: string, email: string, password: string) => {
    try {
      await apiUser.post("/register", { name, email, password });
    } catch (error: any) {
      console.error("Error en registro:", error);
      // Verifica si el error proviene del backend y contiene información relevante
      if (error.response && error.response.data && error.response.data.mensaje) {
        throw new Error(error.response.data.mensaje); // Lanza un error con el mensaje del backend
      } else {
        throw new Error("Error en el servidor, inténtelo más tarde");
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiUser.post("/login", { email, password });

      setUser(response.data.usuario); // Guardamos el usuario en el estado
      
      // Guardar el token de acceso en localStorage
      localStorage.setItem("accessToken", response.data.tokenAcceso);
      // Guardar el refreshToken en localStorage
      localStorage.setItem("refreshToken", response.data.usuario.refreshToken);

      console.log("Usuario autenticado:", response.data.usuario);
    } catch (error: any) {
      console.error("Error en login:", error);

      // Verifica si el error proviene del backend y contiene información relevante
      if (error.response && error.response.data && error.response.data.mensaje) {
        throw new Error(error.response.data.mensaje); // Lanza un error con el mensaje del backend
      } else {
        throw new Error("Error en el servidor, inténtelo más tarde");
      }
    }
  };

  const isTokenValid = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;

      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("Token expirado.");
          const newToken = await refreshAccessToken();
          return newToken ? true : false;
        }
        return true; // Token válido

      } catch (error) {
        console.error("Error al verificar el token:", error);
        return false;
      }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No hay refresh token disponible.");
        return;
      }

      const response = await apiUser.post("/refresh", { refreshToken });

      console.log("Nuevo token de acceso obtenido:", response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      apiUser.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

      return response.data.accessToken;
    } catch (error) {
      console.error("Error al renovar el token de acceso:", error);
      logout(); // Cerrar sesión si falla la renovación
    }
  };



  const logout = async () => {
    try {
      //await apiUser.post("/logout");
      localStorage.removeItem("accessToken"); // Eliminar el accessToken al cerrar sesión
      localStorage.removeItem("refreshToken"); // Eliminar el refreshToken al cerrar sesión
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    setupUserInterceptors(logout); // Configurar interceptores con el logout
}, []);

  return (
    <AuthContext.Provider value={{ user, register, login, isTokenValid, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
