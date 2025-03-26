"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { recipeService } from "@/services/recipeService";

const NewRecipePage = () => {
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        setError(null);
        try {
            const recipe = await recipeService.createRecipe(formData);
            router.push(`/recipes/${recipe.id}`);
        } catch (error) {
            setError("No se pudo crear la receta");
        }
    };
    

  return (
    <ProtectedRoute>
    <div className="container mx-auto py-8">
      <RecipeForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        />
    </div>
    </ProtectedRoute>
  );
};

export default NewRecipePage;