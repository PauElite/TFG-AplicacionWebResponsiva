"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { userService } from "@/services/userService";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { recipeService } from "@/services/recipeService";
import { Toast } from "@/components/ui/Toast";
import { ChevronUp, ChevronDown, Flame, Snowflake } from "lucide-react";


export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getUserById } = userService;
  const [username, setUsername] = useState<any>(null);
  const [creatorId, setCreatorId] = useState<any>(null);
  const { id } = useParams(); // Obtener el ID de la URL dinámica
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        // 1. Espera a que se complete la petición de la receta
        const recipe = await axios.get(`http://localhost:3002/recetas/${id}`);
        setRecipe(recipe.data);

        // 2. Solo si existe creatorId, busca al usuario
        if (recipe.data.creatorId) {
          const response = await getUserById(recipe.data.creatorId);
          setUsername(response.name);
          setCreatorId(recipe.data.creatorId);
        }

      } catch (error) {
        console.error("Error cargando datos de la receta:", error);
      } finally {
        setLoading(false);
      }
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

  const getEmbedMedia = (url: string): { embedUrl: string; platform: "youtube" | "vimeo" | "other" } => {
    // YouTube (watch?v=...)
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
        platform: "youtube"
      };
    }

    // Vimeo (vimeo.com/123456)
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        platform: "vimeo"
      };
    }

    // Otras URLs (videos locales o de otro servidor)
    return {
      embedUrl: url,
      platform: "other"
    };
  };

  // Función para obtener la URL de la imagen
  // (si es una URL externa o una ruta del backend)
  const getImageSrc = (url: string) => {
    // Si empieza por http o https, es una URL externa → usarla tal cual
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Si no, asumimos que es una ruta del backend (por ejemplo: /uploads/...)
    return `http://localhost:3002${url}`;
  };

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

  const handleVote = async (value: 1 | -1) => {
    if (!user) {
      setToast("Debes iniciar sesión para votar");
      return;
    }
    try {
      await recipeService.voteRecipe(recipe.id, user.id, value);
      // Recargar receta tras votar
      const updated = await axios.get(`http://localhost:3002/recetas/${id}`);
      setRecipe(updated.data);
    } catch (error) {
      console.error("❌ Error al votar", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg space-y-6">
        <img
          src={getImageSrc(recipe.imageUrl)}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">{recipe.title}</h1>
          </div>

          <div className="flex flex-col justify-center items-center ml-4">
            <button
              onClick={() => handleVote(1)}
              className="text-green-600 hover:text-green-700 transition-transform hover:scale-110"
              title="Me gusta esta receta"
            >
              <ChevronUp size={24} />
            </button>

            {recipe.popularity !== 0 && (
              <div
                className={`text-lg font-semibold flex items-center gap-1 ${recipe.popularity > 0 ? "text-green-600" : "text-red-500"
                  } animate-pulse`}
                title="Popularidad de la receta"
              >
                {recipe.popularity > 0 ? <Flame size={20} /> : <Snowflake size={20} />}
                {recipe.popularity > 0 ? `+${recipe.popularity}` : recipe.popularity}
              </div>
            )}

            <button
              onClick={() => handleVote(-1)}
              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110"
              title="No me gusta esta receta"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </div>


        <p className="text-gray-600 text-center mb-6 px-2 max-w-2xl">{recipe.description}</p>
        {recipe.suitableFor?.length > 0 && (
          <div className="flex justify-center gap-4 items-center mb-6">
            {recipe.suitableFor.includes("airfrier") && (
              <Link
                href={{ pathname: "/", query: { suitableFor: "airfrier" } }}
                className="group flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src="https://img.icons8.com/external-filled-line-andi-nur-abdillah/64/external-Air-Fryer-home-appliances-(filled-line)-filled-line-andi-nur-abdillah.png"
                  alt="AirFrier"
                  className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125"
                />
                <span className="text-sm font-medium text-gray-700">AirFrier</span>
              </Link>

            )}

            {recipe.suitableFor.includes("horno") && (
              <Link
                href={{ pathname: "/", query: { suitableFor: "horno" } }}
                className="group flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/external-oven-kitchen-kiranshastry-lineal-color-kiranshastry.png"
                  alt="Horno"
                  className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125"
                />
                <span className="text-sm font-medium text-gray-700">Horno</span>
              </Link>
            )}
          </div>
        )}


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
        <div className="space-y-8 mb-6">

          {recipe.instructions.map((step: any, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>

              {step.mediaUrl && step.mediaType === "image" && (
                <img
                  src={`http://localhost:3002${step.mediaUrl}`}
                  alt={`Paso ${index + 1}`}
                  className="w-full max-w-md h-auto rounded-lg mb-4"
                />
              )}

              {step.mediaUrl && step.mediaType === "video" && (() => {
                const { embedUrl, platform } = getEmbedMedia(step.mediaUrl);

                if (platform === "youtube" || platform === "vimeo") {
                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full max-w-md h-64 rounded-lg mb-4"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                }

                return (
                  <video
                    controls
                    src={embedUrl}
                    className="w-full max-w-md h-auto rounded-lg mb-4"
                  >
                    Tu navegador no admite el tag de video.
                  </video>
                );
              })()}


            </div>
          ))}

        </div>
        <h1 className="text-xs text-gray-800 text-right mb-4">
          Receta subida por:{" "}
          <Link
            href={`/profile/${creatorId}`}  // Asegúrate de tener el userId disponible
            className="text-[#8b5e3c] hover:underline"
          >
            {username}
          </Link>
        </h1>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
