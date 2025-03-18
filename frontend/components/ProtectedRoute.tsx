"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isTokenValid, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isTokenValid) {
      logout();
      router.push("/login");
      
    }
  }, [user, isTokenValid, logout, router]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-lg font-bold mb-4">Acceso restringido</h2>
          <p className="text-gray-700">Debes iniciar sesión para acceder a esta página.</p>
          <Link href="/login" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
