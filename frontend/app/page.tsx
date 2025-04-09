"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { recipeService } from "@/services/recipeService";
import { Recipe } from "../../shared/models/recipe";
import { RecipeSlider } from "@/components/recipes/RecipeSlider";
import { RecipeSliderSkeleton } from "@/components/skeleton/RecipeSliderSkeleton";


export default function HomePage() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [loadingPopularRecipes, setLoadingPopularRecipes] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const recipes = await recipeService.fetchPopularRecipes();
        setPopularRecipes(recipes);
        console.log("Recetas populares", recipes);
      } catch (err) {
        console.error("Error al cargar recetas populares", err);
      } finally {
        setLoadingPopularRecipes(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <main className="px-16 py-10 space-y-16">
      {/* Hero o bienvenida */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">Bienvenido a El Fogón Rebelde </h1>
        <p className="text-lg text-gray-600">Explora, descubre y comparte recetas deliciosas de todos los rincones del planeta.</p>
      </section>

      {loadingPopularRecipes ? (
        <RecipeSliderSkeleton />
      ) : (
        popularRecipes.length > 0 && <RecipeSlider recipes={popularRecipes} />
      )}

      {/* Explorar recetas */}
      <section className="bg-gray-100 rounded-xl p-6 text-center space-y-2 shadow-sm">
        <h2 className="text-xl font-semibold">🔍 Explorar recetas</h2>
        <p className="text-gray-600">Filtra por dificultad, tiempo, ingredientes y más.</p>
        <Link href="/recipes" className="inline-block mt-2 bg-[#8b5e3c] text-white px-4 py-2 rounded hover:bg-[#754a2f]">
          Explorar ahora
        </Link>
      </section>

      {/* ¿Qué me cocino hoy? */}
      <section className="bg-yellow-100 rounded-xl p-6 text-center space-y-2 shadow-sm">
        <h2 className="text-xl font-semibold">🤔 ¿Qué me cocino hoy?</h2>
        <p className="text-gray-600">¿No sabes qué preparar? Nosotros te inspiramos.</p>
        <Link href="/random" className="inline-block mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Sorpréndeme
        </Link>
      </section>

      {/* Recetas del mundo */}
      <section className="bg-blue-100 rounded-xl p-6 text-center space-y-2 shadow-sm">
        <h2 className="text-xl font-semibold">🗺️ Recetas del mundo</h2>
        <p className="text-gray-600">Descubre sabores por países en un mapa interactivo.</p>
        <Link href="/mapa" className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ver mapa
        </Link>
      </section>
    </main>
  );
}
