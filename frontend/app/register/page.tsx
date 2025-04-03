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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      setSuccessMessage("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      setErrorMessage("");

      // Redirige tras unos segundos si quieres
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 px-3 py-2 rounded">
            {successMessage}
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
            {errorMessage}
          </div>
        )}

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
        <button type="submit" className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white p-2 rounded w-full text-sm 00 transition">
          Registrarse
        </button>
      </form>
    </div>
  );
}
