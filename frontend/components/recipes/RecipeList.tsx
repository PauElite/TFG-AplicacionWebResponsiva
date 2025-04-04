import Link from "next/link";
import { useState } from "react";


interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    prepTime: number;
}

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
        }, 500); // Simulate loading time
    }

    const getImageSrc = (url: string) => {
        // Si empieza por http o https, es una URL externa → usarla tal cual
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return url;
        }
      
        // Si no, asumimos que es una ruta del backend (por ejemplo: /uploads/...)
        return `http://localhost:3002${url}`;
    };

    if (recipes.length === 0) {
        return <div className="text-center py-8">No se han encontrado recetas</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
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
                    <div className="flex justify-between mt-auto">
                        <Link
                            href={`/recipes/${recipe.id}`}
                            className="text-[#8b5e3c] mt-auto hover:underline"
                        >
                            Ver receta
                        </Link>
                        <div className="flex items-center">
                            <span className="text-gray-800 font-semibold">⏱️</span>
                            <span className="text-gray-800 ml-1">{recipe.prepTime} min</span>
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
    );
};