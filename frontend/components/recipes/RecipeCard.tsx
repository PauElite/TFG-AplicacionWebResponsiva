"use client";

import Link from "next/link";
import { Flame, Snowflake } from "lucide-react";
import { Recipe } from "../../../shared/models/recipe";
import { getImageSrc } from "../../utils/mediaUtils";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const popularity = recipe.popularity ?? 0;

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:scale-[1.08] bg-[#fefefe]"
    >
      {/* Imagen arriba */}
      <div className="w-full h-40 overflow-hidden">
        <img
          src={getImageSrc(recipe.imageUrl)}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido abajo */}
      <div className="p-3 space-y-1">
        <h3 className="text-base text-center font-semibold text-gray-800 truncate">{recipe.title}</h3>

        <div className="flex items-center gap-1 text-sm h-5">
          {typeof popularity === "number" && popularity !== 0 ? (
            popularity > 0 ? (
              <>
                <Flame size={16} className="text-orange-600" />
                <span className="text-orange-600 font-medium">+{popularity}</span>
              </>
            ) : (
              <>
                <Snowflake size={16} className="text-blue-500" />
                <span className="text-blue-500 font-medium">{popularity}</span>
              </>
            )
          ) : (
            null
          )}
        </div>
      </div>
    </Link>
  );
}
