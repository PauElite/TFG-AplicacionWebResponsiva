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

  async fetchRecipes(suitableFor?: string[], search?: string, sort?: string): Promise<Recipe[]> {
    try {
      const response = await apiRecipe.get(this.apiUrl, {
        params: {
          ...(suitableFor?.length ? { suitableFor } : {}),
          ...(search ? { search } : {}),
          ...(sort ? { sort } : {})
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          const suitableFor = params.suitableFor as string[] | undefined;
          const search = params.search as string | undefined;
          const sort = params.sort as string | undefined;

          if (suitableFor?.length) {
            suitableFor.forEach((val) => {
              searchParams.append("suitableFor", val);
            });
          }

          if (search) searchParams.set("search", search);
          if (sort) searchParams.set("sort", sort);

          return searchParams.toString();
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al obtener las recetas", error);
      throw error;
    }
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    try {
      await apiRecipe.delete(`${this.apiUrl}/${recipeId}`);
    } catch (error) {
      console.error("Error al eliminar la receta", error);
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
      const formData = new FormData();

      // Imagen principal
      if (recipeData.imageFile) {
        formData.append("imageFile", recipeData.imageFile);
      }

      // Archivos por paso
      recipeData.instructions.forEach((step) => {
        if (step.file) {
          formData.append("stepFiles", step.file);
        }
      });

      // Preparar JSON limpio sin los archivos
      const { imageFile, ...cleanedData } = recipeData;

      const recipeJSON = {
        ...cleanedData,
        creatorId,
        instructions: recipeData.instructions.map((step) => ({
          title: step.title,
          description: step.description,
          mediaUrl: step.mediaType === "video" ? step.mediaUrl : undefined,
          mediaType: step.mediaType,
        }))
      };

      if (imageFile && recipeJSON.imageUrl === "") {
        delete recipeJSON.imageUrl;
      }

      formData.append("data", JSON.stringify(recipeJSON));

      const response = await apiRecipe.post(this.apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return response.data.newRecipe;
    } catch (error) {
      console.error("Error al crear la receta", error);
      throw error;
    }
  }

  async voteRecipe(recipeId: number, userId: number, value: 1 | -1): Promise<void> {
    try {
      await apiRecipe.post(`${this.apiUrl}/${recipeId}/vote`, { userId, value });
    } catch (error) {
      console.error("Error al votar la receta", error);
      throw error;
    }
  }


}

export const recipeService = new RecipeService();