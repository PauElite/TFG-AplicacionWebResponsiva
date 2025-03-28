"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert("Registro exitoso. Verifica tu email.");
      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 border rounded mb-3 text-sm"
          placeholder="Nombre"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border rounded mb-3 text-sm"
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-4 text-sm"
          placeholder="Contraseña"
        />
        <button type="submit" className="bg-green-300 text-white p-2 rounded w-full text-sm hover:bg-green-200 transition">
          Registrarse
        </button>
      </form>
    </div>
  );
}
