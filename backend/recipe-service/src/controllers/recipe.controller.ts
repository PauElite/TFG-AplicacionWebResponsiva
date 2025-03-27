import { Request, Response, NextFunction } from "express";
import { recipeService } from "../services/recipe.service";
import Joi from "joi";

const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  instructions: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required()
    })
  ).required(),
  prepTime: Joi.number().min(1).required(),
  difficulty: Joi.number().valid(1, 2, 3, 4, 5).required(),
  imageUrl: Joi.string().uri().required(),
  creatorId: Joi.number().required()
});

const updateRecipeSchema = recipeSchema.fork(
  Object.keys(recipeSchema.describe().keys),
  (schema) => schema.optional()
);

// Crear una receta
export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = recipeSchema.validate(req.body);

  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  try {
    const { title, description, ingredients, instructions, prepTime, difficulty, imageUrl, creatorId } = req.body;
    const newRecipe = await recipeService.createRecipe(title, description, ingredients, instructions, prepTime, difficulty, imageUrl, creatorId);
    
    res.status(201).json({ message: "Receta creada con éxito", newRecipe });
  } catch (error) {
    console.error("Error al crear la receta", error);
    next(error);
  }
};

// Obtener una receta por ID
export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next({ status: 400, message: "El ID de la receta es obligatorio" });
  }

  try {
    const recipe = await recipeService.getRecipeById(Number(id));
    if (!recipe) {
      return next({ status: 404, message: "Receta no encontrada" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error al obtener la receta por ID", error);
    next(error);
  }
}

// Actualizar una receta
export const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateRecipeSchema.validate(req.body);

  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  const { id } = req.params;
  if (!id) {
    return next({ status: 400, message: "El ID de la receta es obligatorio" });
  }

  try {
    const updatedRecipe = await recipeService.updateRecipe(Number(id), req.body);
    if (!updatedRecipe) {
      return next({ status: 404, message: "Receta no encontrada" });
    }
    res.status(200).json({ message: "Receta actualizada con éxito", updatedRecipe });
  } catch (error) {
    console.error("Error al actualizar la receta", error);
    next(error);
  }
}

export const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next({ status: 400, message: "El ID de la receta es obligatorio" });
  }

  try {
    const deleted = await recipeService.deleteRecipe(Number(id));
    if (!deleted) {
      return next({ status: 404, message: "Receta no encontrada" });
    }
    res.status(200).json({ message: "Receta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la receta", error);
    next(error);
  }
}

// Obtener todas las recetas
export const getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error al obtener las recetas", error);
    next(error);
  }
};

// Obtener recetas por ID de creador
export const getRecipesByCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { creatorId } = req.params;
    if (!creatorId) {
      return next({ status: 400, message: "El ID del creador es obligatorio" });
    }

    const recipes = await recipeService.getRecipesByCreator(Number(creatorId));
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error al obtener las recetas del creador", error);
    next(error);
  }
}