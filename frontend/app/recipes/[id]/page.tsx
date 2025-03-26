"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { userService } from "@/services/userService";
import { get } from "http";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getUserById } = userService;
  const [username, setUsername] = useState<any>(null);
  const { id } = useParams(); // Obtener el ID de la URL dinámica

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        // 1. Espera a que se complete la petición de la receta
        const recipe = await axios.get(`http://localhost:3002/recetas/${id}`);
        setRecipe(recipe.data);

        // 2. Solo si existe creatorId, busca al usuario
        if (recipe.data.creatorId) {
          const name = await getUserById(recipe.data.creatorId);
          setUsername(name);
        }

      } catch (error) {
        console.error("Error cargando datos de la receta:", error);
      } finally {
        setLoading(false);
      }
      /*if (id) {
        // Obtener los detalles de la receta
        axios
          .get(`http://localhost:3002/recetas/${id}`)
          .then((response) => {
            setRecipe(response.data);
            setUser(getUserById(recipe.creatorId));
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error al obtener la receta:", error);
            setLoading(false);
          });
          
      }*/
    }

    loadRecipe();
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
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg space-y-6">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full max-w-3xl h-64 object-cover rounded-xl mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">{recipe.title}</h1>
        <p className="text-gray-600 text-center mb-6 px-2 max-w-2xl">{recipe.description}</p>
        <div className="flex flex-wrap justify-between items-center gap-4 text-center">
          <div className="text-gray-800">
            <span className="font-semibold">Tiempo de preparación:</span> {recipe.prepTime} min
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <span className="font-semibold">Dificultad:</span>
            {renderDifficulty(Number(recipe.difficulty)).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
        <ul className="list-disc list-inside mb-8 text-sm sm:text-base">
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-4">Instrucciones</h2>
        <div className="space-y-6 mb-6">
          {recipe.instructions.map((step: { title: string, description: string }, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <h1 className="text-xs text-gray-800 text-right mb-4">Receta subida por: {username}</h1>
      </div>
    </div>
  );
}
