import { useEffect, useState } from "react";
import { recipeService } from "@/services/recipeService";

export const useGetRecipesByCreator = (creatorId: number) => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecipes= async () => {
            try {
                const data = await recipeService.fetchRecipesByCreator(creatorId);
                setRecipes(data);
            } catch (error) {
                setError("No se pudieron cargar las recetas del creador");
            } finally {
                setLoadingRecipes(false);
            }
        };

        loadRecipes();
    }, [creatorId]);

    return { recipes, loadingRecipes, error };
}