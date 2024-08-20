import { Recipe } from "../types/types";
import { getAllRecipes } from "../api/api";

export const getLatestRecipes = async (
  count: number = 5
): Promise<Recipe[]> => {
  try {
    const allRecipesResponse = await getAllRecipes();
    return allRecipesResponse
      .sort(
        (a: Recipe, b: Recipe) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, count);
  } catch (error) {
    console.error("Son tarifleri çekerken hata oluştu:", error);
    return [];
  }
};
