"use client";

import { RecipeList } from "@/components/recipes/RecipeList";
import { User } from "@/types/user";
import { userService } from "@/services/userService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetRecipesByCreator } from "@/hooks/useGetRecipesByCreator";

export default function UserProfile() {
    const { getUserById } = userService;
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const { id } = useParams();
    const { recipes, loadingRecipes, error } = useGetRecipesByCreator(Number(id));

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (id) {
                    const response = await getUserById(Number(id));
                    setUser(response);
                }
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            } finally {
                setLoadingUser(false);
            }
        }


        loadUser();
    }, [id]);

    if (loadingUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Cargando perfil...</h1>
            </div>
        );
    } else if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Usuario no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Sección de perfil */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    {/* Avatar del usuario */}
                    <img
                        src={`/avatares/${user.avatar}.webp`}
                        alt={`Avatar de ${user.name}`}
                        className="w-35 h-35 rounded-full object-cover border-2 border-gray-300"
                    />
                    <h1 className="text-2xl font-bold ml-4">{user.name}</h1>
                </div>
            </div>

            {/* Lista de recetas */}
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-4">Recetas del creador</h2>
                <RecipeList recipes={recipes} />
            </div>
        </div>
    );
}