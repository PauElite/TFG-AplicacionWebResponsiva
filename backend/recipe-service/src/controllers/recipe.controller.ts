import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Recipe } from "../models/recipe.model";

const recipeRepository = AppDataSource.getRepository(Recipe);


// Crear una receta
export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, ingredients, instructions, prepTime, difficulty, imageUrl } = req.body;
  
  if (!title || !description || !ingredients || !instructions || !prepTime || !difficulty) {
    return next({ status: 400, message: "Todos los campos son obligatorios" });
  }

  if (typeof title !== "string" || typeof description !== "string" || !Array.isArray(ingredients) || !Array.isArray(instructions) || typeof prepTime !== "number") {
    return next({ status: 400, message: "Los tipos de datos no son correctos" });
  }

  if (prepTime < 1) {
    return next({ status: 400, message: "El tiempo de preparación debe ser mayor a 0" });
  }

  if (difficulty.length > 1 || difficulty < "1" || difficulty > "5") {
    return next({ status: 400, message: "La dificultad debe ser un valor entre 1 y 5" });
  }

  try {
    const newRecipe = recipeRepository.create({
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      difficulty,
      imageUrl
    });
    
    await recipeRepository.save(newRecipe);
    res.status(201).json({ message: "Receta creada con éxito", newRecipe });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las recetas
export const getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeRepository.find();
    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};