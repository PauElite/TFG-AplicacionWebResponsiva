import axios from "axios";
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
}

class RecipeService {
    private apiUrl: string;

    constructor(apiUrl: string = "http://localhost:3002/recetas") {
        this.apiUrl = apiUrl;
    }

    async fetchRecipes(): Promise<Recipe[]> {
        try {
            const response = await axios.get(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las recetas", error);
            throw error;
        }
    }

    async createRecipe(recipeData: RecetaFormData): Promise<Recipe> {
        try {
            const response = await axios.post(this.apiUrl, recipeData);
            return response.data.newRecipe;
        } catch (error) {
            console.error("Error al crear la receta", error);
            throw error;
        }
    }

}

export const recipeService = new RecipeService();