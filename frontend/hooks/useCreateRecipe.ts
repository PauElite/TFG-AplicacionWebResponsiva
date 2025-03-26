import { useState } from 'react';
import { recipeService } from '@/services/recipeService';
import { RecetaFormData } from '@/types/receta';

export const useCreateRecipe = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createRecipe = async (recipe: RecetaFormData) => {
        try {
            setLoading(true);
            const newRecipe = await recipeService.createRecipe(recipe);
            return newRecipe;
        } catch (error) {
            setError("No se pudo crear la receta");
        }
    }
    return { loading, error, createRecipe };
};
