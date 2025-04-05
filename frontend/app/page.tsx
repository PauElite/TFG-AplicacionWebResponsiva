"use client";

import { useGetAllRecipes } from "@/hooks/useGetAllRecipes";
import { RecipeList } from "@/components/recipes/RecipeList";
import { BurgerLoadingAnimation } from "@/components/views/loading/BurgerLoadingAnimation";
import { RecipeFilter } from "@/components/recipes/RecipeFilter";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const suitableFor = searchParams.getAll("suitableFor");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  const { recipes, loading, error } = useGetAllRecipes(suitableFor.length > 0 ? suitableFor : undefined, 
    search, sort);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <RecipeFilter />
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
