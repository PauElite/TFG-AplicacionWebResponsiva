"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams(); // Obtener el ID de la URL dinámica

  useEffect(() => {
    if (id) {
      // Obtener los detalles de la receta
      axios
        .get(`http://localhost:3002/recetas/${id}`)
        .then((response) => {
          setRecipe(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener la receta:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Cargando receta...</h1>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">No se encontró la receta.</h1>
      </div>
    );
  }

  // Función para renderizar las zanahorias llenas y vacías según la dificultad
  const renderDifficulty = (difficulty: number) => {
    const carrots = [];  // Un array para contener las zanahorias
    for (let i = 1; i <= 5; i++) {
      if (i <= difficulty) {
        carrots.push("🥕"); // Zanahoria rellena
      } else {
        carrots.push("⚪"); // Zanahoria vacía
      }
    }
    return carrots;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gray-50">
      {/* Imagen de la receta */}
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />

      <h1 className="text-4xl font-bold text-center mb-4">{recipe.title}</h1>
      <p className="text-gray-600 text-center mb-4">{recipe.description}</p>

      {/* Información adicional: tiempo de preparación y dificultad */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-lg font-medium text-gray-700">
          <strong>Tiempo de preparación:</strong> {recipe.prepTime} min
        </div>
        <div className="text-lg font-medium text-gray-700">
          <strong>Dificultad:</strong> 
          {renderDifficulty(Number(recipe.difficulty)).map((carrot, index) => (
              <span key={index} className="text-yellow-500">{carrot}</span>
            ))}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        {/* Ingredientes */}
        <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
        <ul className="list-disc list-inside mb-8">
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>

        {/* Instrucciones */}
        <h2 className="text-2xl font-bold mb-4">Instrucciones</h2>
        <div className="space-y-6">
          {recipe.instructions.map(
            (step: { title: string; description: string }, index: number) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
