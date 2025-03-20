import express from "express";
import { createRecipe, getAllRecipes } from "../controllers/recipe.controller";

const router = express.Router();

// Definir rutas
router.post("/", createRecipe); // Endpoint para crear una receta
router.get("/", getAllRecipes); // Endpoint para obtener todas las recetas

// Exportar router
export default router;
