"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { useCreateRecipe } from "@/hooks/useCreateRecipe";

const NewRecipePage = () => {
    const router = useRouter();
    const { createRecipe, loading, error } = useCreateRecipe();

    const handleSubmit = async (formData: any) => {
        try {
            const recipe = await createRecipe(formData);
            router.push(`/recipes/${recipe?.id}`);
        } catch (error) {
            error = "No se pudo crear la receta: " + error;
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