import {useState, useEffect} from 'react';
import { recipeService } from '@/services/recipeService';

export const useAllRecipes = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAllRecipes = async () => {
        try {
            setLoading(true);
            const data = await recipeService.fetchRecipes();
            setRecipes(data);
        } catch (error) {
            setError("No se pudieron cargar las recetas");
        } finally {
            setLoading(false);
        }
    };
        
        loadAllRecipes();
    }, []);

    return { recipes, loading, error, reloadAllRecipes: useAllRecipes };
};