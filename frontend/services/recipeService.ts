import { apiRecipe } from "@/utils/apiRecipe";
import { RecetaFormData } from "../types/receta";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  difficulty: number;
  imageUrl: string;
  creatorId: number;
}

class RecipeService {
    private apiUrl: string;

    constructor(apiUrl: string = "http://localhost:3002/recetas") {
        this.apiUrl = apiUrl;
    }

    async fetchRecipes(): Promise<Recipe[]> {
        try {
            const response = await apiRecipe.get(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las recetas", error);
            throw error;
        }
    }

    async fetchRecipesByCreator(creatorId: number): Promise<Recipe[]> {
        try {
            const response = await apiRecipe.get(`${this.apiUrl}/creator/${creatorId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las recetas del creador", error);
            throw error;
        }
    }

    async createRecipe(recipeData: RecetaFormData, creatorId: number): Promise<Recipe> {
        try {
            const response = await apiRecipe.post(this.apiUrl, {...recipeData, creatorId });
            return response.data.newRecipe;
        } catch (error) {
            console.error("Error al crear la receta", error);
            throw error;
        }
    }

}

export const recipeService = new RecipeService();