"use client";

import { useGetAllRecipes } from "@/hooks/useGetAllRecipes";
import { RecipeList } from "@/components/recipes/RecipeList";
import { BurgerLoadingAnimation } from "@/components/views/loading/BurgerLoadingAnimation";

export default function Home() {
  const { recipes, loading, error } = useGetAllRecipes();
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <BurgerLoadingAnimation />
          <h1 className="text-4xl font-bold">Cargando recetas...</h1>
        </div>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </div>
  );
}
