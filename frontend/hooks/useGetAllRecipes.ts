import { useState, useEffect } from 'react';
import { recipeService } from '@/services/recipeService';

export const useGetAllRecipes = (suitableFor?: string[], search?: string) => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadAllRecipes = async () => {
        try {
          const data = await recipeService.fetchRecipes(suitableFor, search);
          setRecipes(data);
        } catch (error) {
          setError("No se pudieron cargar las recetas");
        } finally {
          setLoading(false);
        }
      };
  
      loadAllRecipes();
    }, [suitableFor?.join(","), search]);
  
    return { recipes, loading, error };
  };
  