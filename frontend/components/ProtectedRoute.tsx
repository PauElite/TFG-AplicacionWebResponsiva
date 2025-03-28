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
