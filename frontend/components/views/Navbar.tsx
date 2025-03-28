"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useTransition } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-300 p-4 text-white shadow-md">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link href="/" className="text-lg font-bold">El Fogón Rebelde</Link>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            href="/recipes/new"
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Subir mi propia receta
          </Link>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {user ? (
            <>
              <Link href={`/profile/${user.id}`} className="hover:underline">Perfil</Link>
              <button onClick={logout} className="hover:underline">Cerrar sesión</button>

            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Iniciar sesión</Link>
              <Link href="/register" className="hover:underline">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
