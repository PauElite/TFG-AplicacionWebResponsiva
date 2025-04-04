import { AppDataSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { Recipe } from "../models/recipe.model";

export class RecipeService {
  private recipeRepository: Repository<Recipe>;

  constructor() {
    this.recipeRepository = AppDataSource.getRepository(Recipe);
  }

  // Crear una receta
  async createRecipe(title: string, description: string, ingredients: string[], 
    instructions: any[], prepTime: number, suitableFor: string[], difficulty: string, imageUrl: string, creatorId: number): Promise<Recipe> {
    const newRecipe = this.recipeRepository.create({
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      suitableFor,
      difficulty,
      imageUrl,
      creatorId
    });
    const recipe = await this.recipeRepository.save(newRecipe);

    await AppDataSource.query(
      `UPDATE "user" SET "recipeIds" = array_append("recipeIds", $1) WHERE id = $2`, 
      [recipe.id, creatorId]
    );
    return recipe;

  }

  // Obtener todas las recetas
  // Si se proporciona un parámetro suitableFor, filtra las recetas por ese valor
  async getAllRecipes(suitableFor?: string[]): Promise<Recipe[]> {
    const query = this.recipeRepository.createQueryBuilder("recipe");
  
    if (suitableFor && suitableFor.length > 0) {
      // Genera condiciones del tipo: 'airfrier' = ANY(recipe.suitableFor)
      suitableFor.forEach((value, index) => {
        const param = `value${index}`;
        const condition = `:${param} = ANY(recipe.suitableFor)`;
        if (index === 0) {
          query.where(condition, { [param]: value });
        } else {
          query.orWhere(condition, { [param]: value });
        }
      });
    }
  
    return await query.getMany();
  }
  

  // Obtener una receta por ID
  async getRecipeById(id: number): Promise<Recipe | null> {
    return await this.recipeRepository.findOne({ where: { id } });
  }

  // Actualizar una receta
  async updateRecipe(id: number, updateData: Partial<Recipe>): Promise<Recipe | null> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      return null;  // Si la receta no existe, devuelve null
    }

    // Actualiza las propiedades de la receta
    Object.assign(recipe, updateData);

    return await this.recipeRepository.save(recipe);  // Guardar la receta actualizada
  }

  // Eliminar una receta
  async deleteRecipe(id: number): Promise<boolean> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      return false;  // Si no se encuentra la receta, no se puede eliminar
    }

    await this.recipeRepository.remove(recipe);
    return true;  // Receta eliminada con éxito
  }

  // Obtener recetas por ID de creador
  async getRecipesByCreator(creatorId: number): Promise<Recipe[]> {
    return await this.recipeRepository.find({ where: { creatorId } });
  }

}

export const recipeService = new RecipeService();
