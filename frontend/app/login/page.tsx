"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/perfil"); // Redirige al perfil tras el login
    } catch (error) {
      alert("Error en el login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border rounded mb-2" placeholder="Correo electrónico"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-2" placeholder="Contraseña"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Entrar</button>
      </form>
    </div>
  );
}
