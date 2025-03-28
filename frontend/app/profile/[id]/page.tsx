"use client";

import { RecipeList } from "@/components/recipes/RecipeList";
import { User } from "@/types/user";
import { userService } from "@/services/userService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetRecipesByCreator } from "@/hooks/useGetRecipesByCreator";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function UserProfile() {
    const { getUserById } = userService;
    const [userData, setUserData] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const { id } = useParams();
    const { recipes, loadingRecipes, error } = useGetRecipesByCreator(Number(id));
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getUserById(Number(id));
                setUserData(response);
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            } finally {
                setLoadingUser(false);
            }
        }


        if (id) loadUser();
    }, [id]);

    
    if (loadingUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Cargando perfil...</h1>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Usuario no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Sección de perfil */}
            <div className="mb-8">
                <div className="flex flex-col items-center justify-between sm:flex-row sm:items-center mb-4">
                    <div className="flex flex-col sm:flex-row items-center">
                    {/* Avatar del usuario */}
                    <img
                        src={`/avatares/${userData.avatar}.webp`}
                        alt={`Avatar de ${userData.name}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-35 lg:h-35 rounded-full object-cover border-2 border-gray-300"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-0 sm:ml-4 md:ml-6 lg:ml-8">
                        {userData.name}
                    </h1>
                    </div>
                    {currentUser?.id === userData.id && (
                        <Link
                            href="/profile/edit"
                            className="bg-green-300 hover:bg-green-200 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Editar perfil
                        </Link>
                    )}
                </div>
            </div>

            {/* Lista de recetas */}
            <div className="p-2 sm:p-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Recetas del creador</h2>
                <RecipeList recipes={recipes} />
            </div>
        </div>
    );
}