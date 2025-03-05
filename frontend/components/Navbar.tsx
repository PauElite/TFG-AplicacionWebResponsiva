"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">Mi Aplicación</Link>

        <div className="flex gap-4">
          {user ? (
            <>
              <Link href="/perfil" className="hover:underline">Perfil</Link>
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
