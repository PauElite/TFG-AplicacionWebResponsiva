"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { recipeService } from "@/services/recipeService";
import { Toast } from "@/components/ui/Toast";
import { ChevronUp, ChevronDown, Flame, Snowflake, Trash2, Pencil } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { getEmbedMedia, getImageSrc } from "@/utils/mediaUtils";


export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<any>(null);
  const [creatorId, setCreatorId] = useState<any>(null);
  const { id } = useParams(); // Obtener el ID de la URL dinámica
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  // Estados para la información nutricional
  const [nutritionalData, setNutritionalData] = useState<any>(null);
  const [showNutrition, setShowNutrition] = useState<boolean>(false);


  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await recipeService.getRecipeById(Number(id));
        setRecipe(recipeData);

        if (recipeData) {
          const user = await userService.getUserById(recipeData.creatorId);
          setUsername(user.name);
          setCreatorId(recipeData.creatorId);
        }

      } catch (error) {
        console.error("Error cargando datos de la receta:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRecipe();
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

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(recipe.id);
      router.push("/"); // Redirige al home tras eliminar
    } catch (error) {
      console.error("❌ Error al eliminar receta:", error);
      setToast("No se pudo eliminar la receta.");
    }
  };

  // Función para alternar la visibilidad de la info nutricional
  const handleToggleNutrition = async () => {
    // Si se va a mostrar y aún no se han obtenido los datos, hacer la petición
    if (!showNutrition && !nutritionalData) {
      try {
        const response = await axios.post(
          "https://trackapi.nutritionix.com/v2/natural/nutrients",
          { query: recipe.ingredients.join("\n") },
          {
            headers: {
              "x-app-id": "419a51cd",
              "x-app-key": "cbddf39aad6117409de2621edc93af54",
              "Content-Type": "application/json",
            },
          }
        );
        setNutritionalData(response.data);
      } catch (error) {
        console.error("Error al obtener información nutricional:", error);
        setToast("Error al obtener información nutricional");
      }
    }
    setShowNutrition(!showNutrition);
  };

  // Si se dispone de datos nutricionales, sumar los valores totales
  let totalNutrition = null;
  if (nutritionalData && nutritionalData.foods) {
    totalNutrition = nutritionalData.foods.reduce(
      (acc: any, food: any) => {
        acc.calories += food.nf_calories || 0;
        acc.protein += food.nf_protein || 0;
        acc.fat += food.nf_total_fat || 0;
        acc.carbs += food.nf_total_carbohydrate || 0;
        return acc;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }

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
                href={{ pathname: "/recipes", query: { suitableFor: "airfrier" } }}
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
                href={{ pathname: "/recipes", query: { suitableFor: "horno" } }}
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

        {/* Botón para mostrar/ocultar la información nutricional */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleToggleNutrition}
            className="px-4 py-2 bg-[#8b5e3c] text-white rounded hover:bg-[#7a4c32] transition-colors flex items-center gap-2"
          >
            {showNutrition ? "Ocultar información nutricional" : "Ver información nutricional"}
            {showNutrition ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showNutrition && totalNutrition && (
          <div className="mt-4 rounded-3xl shadow-2xl p-4 bg-gray-200">
            <h3 className="text-xl font-bold mb-4 text-center">🧪 Información Nutricional Total</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Calorías */}
              <div className="bg-orange-100 text-orange-800 p-4 rounded-xl shadow flex flex-col items-center">
                <img src="https://img.icons8.com/emoji/48/fire.png" alt="Calorías" className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Calorías</span>
                <span className="text-2xl font-bold">{totalNutrition.calories.toFixed(0)}</span>
                <span className="text-xs text-gray-600 mt-1">kcal</span>
              </div>

              {/* Carbohidratos */}
              <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow flex flex-col items-center">
                <img src="https://img.icons8.com/external-filled-outlines-amoghdesign/32/external-carbohydrates-fruits-and-vegetables-filled-outlines-amoghdesign.png" alt="Carbohidratos" className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Carbohidratos</span>
                <span className="text-2xl font-bold">{totalNutrition.carbs.toFixed(1)}</span>
                <span className="text-xs text-gray-600 mt-1">g</span>
              </div>

              {/* Grasas */}
              <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow flex flex-col items-center">
                <img src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-oil-industry-flaticons-flat-flat-icons.png" alt="Grasas" className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Grasas</span>
                <span className="text-2xl font-bold">{totalNutrition.fat.toFixed(1)}</span>
                <span className="text-xs text-gray-600 mt-1">g</span>
              </div>

              {/* Proteínas */}
              <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow flex flex-col items-center">
                <img src="https://img.icons8.com/pulsar-color/48/protein-supplement.png" alt="Proteínas" className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Proteínas</span>
                <span className="text-2xl font-bold">{totalNutrition.protein.toFixed(1)}</span>
                <span className="text-xs text-gray-600 mt-1">g</span>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Instrucciones</h2>
        <div className="space-y-8 mb-6">

          {recipe.instructions.map((step: any, index: number) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm ">
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>

              {step.mediaUrl && step.mediaType === "image" && (
                <img
                  src={getImageSrc(step.mediaUrl)}
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
        {user?.id === creatorId && (
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => router.push(`/recipes/edit/${recipe.id}`)}
              className="text-sm text-[#8b5e3c] flex items-center gap-2 hover:underline"
            >
              <Pencil size={18} /> Editar receta
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-red-600 flex items-center gap-2 hover:underline"
            >
              <Trash2 size={18} /> Eliminar receta
            </button>
          </div>
        )}
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
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          message="¿Estás seguro de que deseas eliminar esta receta?"
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />

      )}
    </div>
  );
}
