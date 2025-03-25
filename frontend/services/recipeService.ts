import { throws } from "assert";
import axios from "axios";

class RecipeService {
    private apiUrl: string;

    constructor(apiUrl: string = "http://localhost:3002/recetas") {
        this.apiUrl = apiUrl;
    }

    async fetchRecipes() {
        try {
            const response = await axios.get(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las recetas", error);
            throw error;
        }
    }

}

export const recipeService = new RecipeService();