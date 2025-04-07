"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { Anton } from "next/font/google";

const anton = Anton({
  weight: "400", // Anton solo tiene peso 400
  subsets: ["latin"],
});

export default function Navbar() {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState<string | null>(null);


  return (
    <nav className="bg-[#8b5e3c] p-4 text-white shadow-md">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link href="/" className={`${anton.className} text-2xl text-center tracking-wide underline`}>El Fogón Rebelde</Link>

        <div className="flex flex-row items-center gap-4 flex-wrap justify-center">
          <Link
            href="/recipes/new"
            onClick={(e) => {
              if (!user) {
                e.preventDefault(); // Evita la navegación
                setToast("Debes iniciar sesión para subir una receta");
              }
            }}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <img width="24" height="24" src="https://img.icons8.com/pulsar-line/48/upload.png" alt="upload" />
            Subir mi propia receta
          </Link>

        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {user ? (
            <>
              <Link href={`/profile/${user.id}`} className={`${anton.className} hover:underline tracking-wide`}>Perfil</Link>
              <button onClick={logout} className={`${anton.className} hover:underline tracking-wide`}>Cerrar sesión</button>

            </>
          ) : (
            <>
              <Link href="/login" className={`${anton.className} hover:underline tracking-wide`}>Iniciar sesión</Link>
              <Link href="/register" className={`${anton.className} hover:underline tracking-wide`}>Registrarse</Link>
            </>
          )}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </nav>
  );
}
