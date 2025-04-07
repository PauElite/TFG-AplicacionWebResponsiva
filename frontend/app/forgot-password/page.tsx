"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { userService } from "@/services/userService";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToastMessage("Introduce un correo válido.");
      return;
    }

    setLoading(true);

    try {
      const message = await userService.forgotPassword(email);

      setToastMessage(message || "Correo enviado con instrucciones.");
      setEmail("");
    } catch (error: any) {
      setToastMessage(error.message || "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Recuperar contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border rounded mb-4 text-sm border-gray-300"
          placeholder="Correo electrónico"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white p-2 rounded w-full text-sm transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </button>
      </form>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
