"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/perfil");
        setUser(response.data.usuario);
      } catch (error) {
        console.warn("Sesión no válida, intentando renovar token...");
  
        await refreshAccessToken(); // Intenta renovar el token si la sesión es inválida
      }
    };
  
    checkUser();
  }, []);
  

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
  
      setUser(response.data.usuario); // Guardamos el usuario en el estado
  
      // Guardar el token de acceso en localStorage
      localStorage.setItem("accessToken", response.data.tokenAcceso);
      // Guardar el refreshToken en localStorage
      localStorage.setItem("refreshToken", response.data.usuario.refreshToken);
  
      console.log("Usuario autenticado:", response.data.usuario);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };
  
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No hay refresh token disponible.");
        return;
      }
  
      const response = await api.post("/refresh", { refreshToken });
  
      console.log("Nuevo token de acceso obtenido:", response.data.accessToken);
    } catch (error) {
      console.error("Error al renovar el token de acceso:", error);
    }
  };
  


  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      localStorage.removeItem("refreshToken"); // Eliminar el refreshToken al cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
