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
  // Si se proporciona un parámetro search, busca recetas por título o ingredientes
  // Si no se proporciona ninguno, devuelve todas las recetas
  async getAllRecipes(suitableFor?: string[], search?: string): Promise<Recipe[]> {
    const query = this.recipeRepository.createQueryBuilder("recipe");
    const whereParts: string[] = [];
    const params: Record<string, any> = {};
  
    // suitableFor → OR conditions agrupadas
    if (suitableFor && suitableFor.length > 0) {
      suitableFor.forEach((value, index) => {
        const paramName = `suitable${index}`;
        whereParts.push(`:${paramName} = ANY(recipe.suitableFor)`);
        params[paramName] = value;
      });
    }
  
    // search → AND condition
    if (search) {
      const searchParam = `%${search.toLowerCase()}%`;
      const searchCondition = `(LOWER(recipe.title) ILIKE :search OR EXISTS (
        SELECT 1 FROM unnest(recipe.ingredients) AS ingredient
        WHERE LOWER(ingredient) ILIKE :search
      ))`;
      whereParts.push(searchCondition);
      params["search"] = searchParam;
    }
  
    // Unir condiciones: suitableFor con OR entre paréntesis, y AND con search
    if (whereParts.length > 0) {
      const suitableForPart = suitableFor?.length
        ? `(${whereParts.slice(0, suitableFor.length).join(" OR ")})`
        : null;
      const searchPart = search ? whereParts[whereParts.length - 1] : null;
  
      const finalWhere =
        suitableForPart && searchPart
          ? `${suitableForPart} AND ${searchPart}`
          : suitableForPart || searchPart;
  
      if (finalWhere) {
        query.where(finalWhere, params);
      }
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
