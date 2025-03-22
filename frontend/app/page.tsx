"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);  // Para almacenar las recetas
  const [loading, setLoading] = useState<boolean>(true);  // Para manejar el estado de carga

  // Función para obtener las recetas desde el backend
  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3002/recetas"); // URL del backend
      setRecipes(response.data);  // Guardamos las recetas en el estado
    } catch (error) {
      console.error("Error al obtener las recetas", error);
    } finally {
      setLoading(false);  // Finalizamos el estado de carga
    }
  };

  useEffect(() => {
    fetchRecipes();  // Llamamos a la función cuando el componente se monte
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Cargando recetas...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-1">
      <h1 className="text-4xl font-bold text-center mb-6">Bienvenido a El Fogón Rebelde</h1>

      {/* Aquí hemos añadido un margen entre el título y las recetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white p-4 rounded shadow-md">
            <Link href={`/recipes/${recipe.id}`}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
              />
            </Link>
            <h2 className="text-2xl font-bold mt-4">{recipe.title}</h2>
            <p className="text-gray-600 mt-2">{recipe.description}</p>
            <Link href={`/recipes/${recipe.id}`} className="text-blue-500 mt-4 block hover:underline">
  Ver receta
</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
