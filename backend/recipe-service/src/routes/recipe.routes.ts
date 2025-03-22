import express from "express";
import { createRecipe, getRecipeById, updateRecipe, deleteRecipe, getAllRecipes } from "../controllers/recipe.controller";

const router = express.Router();

// Definir rutas
router.post("/", createRecipe); // Endpoint para crear una receta
router.get("/:id", getRecipeById); // Endpoint para obtener una receta por ID
router.put("/:id", updateRecipe); // Endpoint para actualizar una receta por ID
router.delete("/:id", deleteRecipe); // Endpoint para eliminar una receta por ID
router.get("/", getAllRecipes); // Endpoint para obtener todas las recetas

// Exportar router
export default router;
