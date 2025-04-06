import type { Recipe } from "../../shared/models/recipe";

export type RecetaFormData = Omit<Recipe, "id" | "creatorId" | "popularity">;
