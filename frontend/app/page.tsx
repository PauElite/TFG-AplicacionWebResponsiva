"use client";

import { useAllRecipes } from "@/hooks/useAllRecipes";
import { RecipeList } from "@/components/RecipeList";

export default function Home() {
  const { recipes, loading, error } = useAllRecipes();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Cargando recetas...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        Bienvenido a El Fogón Rebelde
      </h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}
