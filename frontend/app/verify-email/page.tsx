"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<"pending" | "success" | "error" | "expired">("pending");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [loadingResend, setLoadingResend] = useState(false);


    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setStatus("error");
                setMessage("Token de verificación no proporcionado.");
                return;
            }
    
            try {
                const res = await fetch(`http://localhost:3001/recetas/users/verify-email?token=${token}`);
    
                const contentType = res.headers.get("content-type");
                let data: any = {};
    
                if (contentType && contentType.includes("application/json")) {
                    data = await res.json();
                } else {
                    const text = await res.text();
                    data.message = text;
                }
    
                if (res.ok) {
                    setStatus("success");
                    setMessage(data.message || "¡Correo verificado con éxito!");
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                } else {
                    if (data.message?.toLowerCase().includes("expirado")) {
                        console.log("Token expirado:", data.message);
                        setStatus("expired");
                    } else {
                        console.log("Error al verificar el correo:", data.message);
                        setStatus("error");
                    }
                    setMessage(data.message || `Error ${res.status}: No se pudo verificar el correo.`);
                }
            } catch (err: any) {
                console.error(err);
                setStatus("error");
                setMessage(err.message || "Error de conexión con el servidor.");
            }
        };
    
        verifyEmail();
    }, [searchParams, router]);
    

    const handleResend = async () => {
        setResendMessage("");
        setLoadingResend(true);

        if (!email) {
            setResendMessage("Por favor, introduce tu correo.");
            setLoadingResend(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/recetas/users/resend-verification-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setResendMessage("✅ Se ha enviado un nuevo enlace de verificación.");
            } else {
                setResendMessage(`❌ ${data.message || "Error al reenviar el correo."}`);
            }
        } catch (err) {
            setResendMessage("❌ Error de conexión con el servidor.");
        } finally {
            setLoadingResend(false);
        }
    };


    return (
        <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
                {status === "pending" && (
                    <p className="text-gray-600 text-sm">Verificando tu correo electrónico...</p>
                )}

                {status === "success" && (
                    <p className="text-green-600 font-medium text-sm">
                        {message} <br /> Serás redirigido al login...
                    </p>
                )}

                {status === "error" && (
                    <p className="text-red-500 font-medium text-sm">{message}</p>
                )}

                {status === "expired" && (
                    <>
                        <p className="text-yellow-600 font-medium text-sm mb-4">{message}</p>
                        <p className="text-sm mb-2">¿Quieres que te enviemos otro enlace?</p>
                        <input
                            type="email"
                            placeholder="Tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded text-sm mb-2"
                        />
                        <button
                            onClick={handleResend}
                            disabled={loadingResend}
                            className={`bg-[#8b5e3c] text-white px-4 py-2 rounded text-sm transition flex items-center justify-center w-full ${loadingResend ? "opacity-70 cursor-not-allowed" : "hover:bg-[#a66b47c4]"
                                }`}
                        >
                            {loadingResend ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Reenviar enlace"
                            )}
                        </button>
                        {resendMessage && (
                            <p className="mt-2 text-sm">{resendMessage}</p>
                        )}
                    </>
                )}
            </div>
    );
}
