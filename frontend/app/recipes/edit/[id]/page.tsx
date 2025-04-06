"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { recipeService } from "@/services/recipeService";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { RecetaFormData } from "@/types/receta";
import { Toast } from "@/components/ui/Toast";
import { Recipe } from "../../../../../shared/models/recipe";
import { BurgerLoadingAnimation } from "@/components/views/loading/BurgerLoadingAnimation";

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<RecetaFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipe = await recipeService.getRecipeById(Number(id));

        if (!recipe) {
          setError("Receta no encontrada");
          return;
        }

        const { title, description, ingredients, instructions, prepTime, suitableFor, difficulty, imageUrl } = recipe as Recipe;

        setInitialData({
          title,
          description,
          ingredients,
          instructions: instructions.map(step => ({
            title: step.title,
            description: step.description,
            mediaUrl: step.mediaUrl,
            mediaType: step.mediaType,
            file: null,
          })),
          prepTime,
          suitableFor,
          difficulty: String(difficulty),
          imageUrl: imageUrl || "",
        });

      } catch (err) {
        console.error("Error cargando receta para editar", err);
        setError("No se pudo cargar la receta");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleSubmit = async (formData: RecetaFormData) => {
    setSaving(true);
    try {
      await recipeService.updateRecipe(Number(id), formData);
      router.push(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setToast("No se pudo actualizar la receta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <BurgerLoadingAnimation />
        <h1 className="text-3xl font-bold mt-4">Cargando receta para editar...</h1>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600">
        {error || "Error al cargar la receta"}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <RecipeForm onSubmit={handleSubmit} loading={saving} error={toast} initialData={initialData}/>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
