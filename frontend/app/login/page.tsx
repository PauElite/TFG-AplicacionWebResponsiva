"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      let hasError = false;
      setEmailError("");
      setPasswordError("");

      if (!validateEmail(email)) {
        setEmailError("Introduce un correo electrónico válido");
        hasError = true;
      }

      if (!password) {
        setPasswordError("Introduce la contraseña.");
        hasError = true;
      }

      if (hasError) return;

      await login(email, password);
      router.push("/");
    } catch (error: any) {
      setPassword("");
      setToastMessage(error.message || "Ocurrió un error al iniciar sesión.");
    }

  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white p-6 rounded-3xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <div className="mb-3">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full p-2 border rounded text-sm ${emailError ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Correo electrónico"
          />
          {emailError && (
            <p className="text-sm text-red-500 mt-1">{emailError}</p>
          )}
        </div>

        <div className="">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-2 pr-10 py-2 border rounded text-sm appearance-none ${passwordError ? "border-red-500" : "border-gray-300"
                }`}
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

          <div className="min-h-[20px] mt-1">
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>
        </div>

        {/* Enlace para recuperar contraseña */}
        <div className="mb-4 text-right">
          <Link
            href="/forgot-password"
            className="text-xs text-[#8b5e3c] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button
          type="submit"
          className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white p-2 rounded w-full text-sm transition"
        >
          Entrar
        </button>
        {/* Enlace a registro */}
        <p className="text-sm text-center mt-4">
          ¿En serio aún no tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-[#8b5e3c] hover:underline font-medium"
          >
            Regístrate
          </Link>
        </p>
      </form>
      {/* Mostrar Toast si hay mensaje */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}