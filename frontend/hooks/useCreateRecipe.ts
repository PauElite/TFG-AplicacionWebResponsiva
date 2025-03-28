import { useState } from 'react';
import { recipeService } from '@/services/recipeService';
import { RecetaFormData } from '@/types/receta';
import { useAuth } from '@/context/AuthContext';

export const useCreateRecipe = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const createRecipe = async (recipe: RecetaFormData) => {
        const startTime = Date.now();
        try {
            if (!user?.id) {
                throw new Error("No se ha iniciado sesión");
            }

            setLoading(true);
            setError(null);

            const newRecipe = await recipeService.createRecipe(recipe, user.id);
            return newRecipe;
        } catch (error) {
            setError("No se pudo crear la receta");
            throw error;
        } finally {
            const elapsed = Date.now() - startTime;
            const minDelay = 500;
            if (elapsed < minDelay) {
                await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
            }
            setLoading(false);
        }
    }
    return { loading, error, createRecipe };
};

