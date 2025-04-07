"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { userService } from "@/services/userService";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validatePassword = (password: string) => {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setToastMessage("Falta el token de recuperación.");
            return;
        }

        if (!validatePassword(newPassword)) {
            setToastMessage("La contraseña debe tener al menos 5 caracteres y contener letras y números.");
            return;
        }

        setLoading(true);

        try {
            const message = await userService.resetPassword(token, newPassword);
            setToastMessage(message);
            setSuccess(true);
            setNewPassword("");

            // Redirigir tras unos segundos
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: any) {
            setToastMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
            {success ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-[#8b5e3c] rounded-full animate-spin" />
                    <p className="text-sm text-gray-700">Contraseña actualizada. Redirigiendo al inicio de sesión...</p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-3xl shadow-md w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Restablecer contraseña
                    </h2>

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full p-2 pr-10 border rounded mb-4 text-sm border-gray-300"
                            placeholder="Nueva contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white p-2 rounded w-full text-sm transition disabled:opacity-50"
                    >
                        {loading ? "Actualizando..." : "Actualizar contraseña"}
                    </button>
                </form>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
}
