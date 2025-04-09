import Link from "next/link";
import { useState } from "react";
import { Recipe } from "../../../shared/models/recipe";
import { Flame, Snowflake } from "lucide-react";

interface RecipeListProps {
    recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(false);

    const visibleRecipes = recipes.slice(0, visibleCount);

    const loadMoreRecipes = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount((prevCount) => prevCount + 6);
            setLoading(false);
        }, 500);
    };

    const getImageSrc = (url: string | undefined) => {
        if (url?.startsWith("http://") || url?.startsWith("https://")) return url;
        return `http://localhost:3002${url}`;
    };

    if (recipes.length === 0) {
        return <div className="text-center py-8">No se han encontrado recetas</div>;
    }

    return (
        <div className="w-full px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                {visibleRecipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white p-4 rounded shadow-md flex flex-col">
                        <Link href={`/recipes/${recipe.id}`}>
                            <img
                                src={getImageSrc(recipe.imageUrl)}
                                alt={recipe.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        </Link>
                        <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>

                        <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>

                        {/* Footer: Ver receta - Popularidad - Tiempo */}
                        <div className="flex justify-between items-center mt-auto">
                            {/* Ver receta */}
                            <Link
                                href={`/recipes/${recipe.id}`}
                                className="text-[#8b5e3c] hover:underline"
                            >
                                Ver receta
                            </Link>

                            {/* Popularidad centrada */}
                            {recipe.popularity !== 0 && (
                                <div
                                    className={`text-sm font-medium flex items-center gap-1 ${recipe.popularity > 0 ? "text-green-600" : "text-red-500"
                                        } animate-pulse`}
                                    title="Popularidad de la receta"
                                >
                                    {recipe.popularity > 0 ? <Flame size={18} /> : <Snowflake size={18} />}
                                    {recipe.popularity > 0 ? `+${recipe.popularity}` : recipe.popularity}
                                </div>
                            )}

                            {/* Tiempo */}
                            <div className="flex items-center text-gray-800">
                                <span className="font-semibold">⏱️</span>
                                <span className="ml-1">{recipe.prepTime} min</span>
                            </div>
                        </div>
                    </div>
                ))}
                {visibleRecipes.length < recipes.length && (
                    <div className="col-span-full text-center mt-8">
                        <button
                            onClick={loadMoreRecipes}
                            disabled={loading}
                            className="bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white px-6 py-2 rounded  disabled:bg-[#8b5e3c8f]"
                        >
                            {loading ? 'Cargando...' : 'Mostrar más recetas'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
