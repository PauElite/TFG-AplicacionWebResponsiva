"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isTokenValid, logout } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      if (!user) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const isValid = await isTokenValid();
        if (!isValid) {
          logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        logout();
        router.push("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [user, isTokenValid, logout, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-0 sm:ml-4 md:ml-6 lg:ml-8">Verificando autenticación...</h1>
      </div>
  );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center px-4">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Acceso restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
          <Link
            href="/login"
            className="inline-block bg-green-300 text-white px-5 py-2 rounded hover:bg-green-200 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
