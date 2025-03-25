import Link from "next/link";

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
    if (recipes.length === 0) {
        return <div className="text-center py-8">No hay recetas disponibles</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white p-4 rounded shadow-md flex flex-col">
                    <Link href={`/recipes/${recipe.id}`}>
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                    </Link>
                    <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
                    <div className="flex justify-between mt-auto">
                        <Link
                            href={`/recipes/${recipe.id}`}
                            className="text-blue-500 mt-auto hover:underline"
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
        </div>
    );
};