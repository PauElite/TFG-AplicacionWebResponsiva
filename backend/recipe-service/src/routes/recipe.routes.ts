import express from "express";
import { createRecipe, getRecipeById, updateRecipe, deleteRecipe, getAllRecipes, getRecipesByCreator } from "../controllers/recipe.controller";
import { recipeUploads } from "../middlewares/uploadMedia.middleware";

const router = express.Router();

// Definir rutas
router.post("/", recipeUploads, createRecipe); // Endpoint para crear una receta
router.get("/:id", getRecipeById); // Endpoint para obtener una receta por ID
router.put("/:id", updateRecipe); // Endpoint para actualizar una receta por ID
router.delete("/:id", deleteRecipe); // Endpoint para eliminar una receta por ID
router.get("/", getAllRecipes); // Endpoint para obtener todas las recetas
router.get("/creator/:creatorId", getRecipesByCreator); // Endpoint para obtener recetas por ID de creador

// Exportar router
export default router;
