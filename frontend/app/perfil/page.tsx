"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PerfilPage() {
  const { isTokenValid, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isTokenValid();
      if (!valid) {
        //router.push("/login"); // Redirige si no hay token válido
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, isTokenValid]);
    return (
      <ProtectedRoute>
        <div className="container mx-auto text-center p-6">
          <h1 className="text-2xl font-bold">Bienvenido a tu perfil</h1>
        </div>
      </ProtectedRoute>
    );
  }