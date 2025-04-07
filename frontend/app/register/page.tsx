"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/Toast";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setToastMessage("Rellena todos los campos.");
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage("Introduce un correo válido.");
      return;
    }

    if (!validatePassword(password)) {
      setToastMessage(
        "La contraseña debe tener al menos 5 caracteres y contener letras y números."
      );
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess(true);
      setToastMessage("Registro exitoso. Revisa tu correo.");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setToastMessage(error.message || "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      {success ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-t-transparent border-[#8b5e3c] rounded-full animate-spin" />
          <p className="text-sm text-gray-700">
            Registro completado. Redirigiendo al inicio de sesión...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-6 rounded-3xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mb-3 text-sm"
            placeholder="Nombre"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mb-3 text-sm"
            placeholder="Correo electrónico"
          />

          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-2 pr-10 border border-gray-300 rounded text-sm"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Puedes añadir validación visual debajo si quieres */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white p-2 rounded w-full text-sm transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          <p className="text-sm text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="text-[#8b5e3c] hover:underline font-medium"
            >
              Inicia sesión
            </a>
          </p>
        </form>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
