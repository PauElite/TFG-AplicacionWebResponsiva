import axios from "axios";

const APP_ID = "419a51cd";
const API_KEY = "cbddf39aad6117409de2621edc93af54";

export async function getNutritionalInfo(ingredients: string[]): Promise<any> {
  try {
    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query: ingredients.join("\n") },
      {
        headers: {
          "x-app-id": APP_ID,
          "x-app-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al consultar la API de Nutritionix:", error?.response?.data || error);
    throw error;
  }
}
