"use client";

import { useEffect, useRef, useState } from "react";
import { Recipe } from "../../../shared/models/recipe";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface RecipeSliderProps {
  recipes: Recipe[];
}

const AUTO_SLIDE_INTERVAL = 3000;

export const RecipeSlider: React.FC<RecipeSliderProps> = ({ recipes }) => {
  const [recipesPerView, setRecipesPerView] = useState(3);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setRecipesPerView(1);
      else if (width < 1024) setRecipesPerView(2);
      else setRecipesPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(recipes.length / recipesPerView);

  const handleNext = () => {
    setSlideIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSlideIndex((prev) => (prev - 1 < 0 ? totalSlides - 1 : prev - 1));
  };

  // 🔁 Auto-slide con pausa
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, AUTO_SLIDE_INTERVAL);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slideIndex, isPaused, recipesPerView]);

  return (
    <section className="relative mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span>🔥</span> Recetas más populares
        </h2>
        <Link
          href="/recipes?sort=popularity"
          className="text-sm text-[#8b5e3c] hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      <div
        className="relative w-full group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Botón izquierdo */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* Carrusel */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${100 * totalSlides}%`,
              transform: `translateX(-${(100 / totalSlides) * slideIndex}%)`,
            }}
          >
            {recipes.map((recipe, idx) => (
              <div
                key={recipe.id}
                className="px-2"
                style={{
                  width: `${100 / (recipesPerView * totalSlides)}%`,
                  flexShrink: 0,
                }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>

        {/* Botón derecho */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};
