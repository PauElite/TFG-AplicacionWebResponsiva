"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { useCreateRecipe } from "@/hooks/useCreateRecipe";
import { useAuth } from "@/context/AuthContext";

const NewRecipePage = () => {
  const router = useRouter();
  const { createRecipe, loading, error } = useCreateRecipe();
  const { isTokenValid, logout } = useAuth();
  
  const handleSubmit = async (formData: any) => {
    try {

      const isValid = await isTokenValid();
      if (!isValid) {
        console.log("Token no válido");
        logout();
        router.push("/login");
      }
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