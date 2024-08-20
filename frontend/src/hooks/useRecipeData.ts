import { useState, useEffect } from "react";
import { useRecipe } from "../contexts/RecipeContext";
import { getAllRecipes, getFavorites, toggleFavorite } from "../api/api";
import { Recipe } from "../types/types";

export function useRecipeData() {
  const { recipes, favorites, setRecipes, setFavorites } = useRecipe();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [recipesData, favoritesData] = await Promise.all([
          getAllRecipes(),
          getFavorites(),
        ]);
        setRecipes(recipesData);
        setFavorites(favoritesData.map((fav: Recipe) => fav._id));
        setError(null);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setError(
          "Tarifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setRecipes, setFavorites]);

  const handleFavoriteToggle = async (recipeId: string) => {
    try {
      const { isFavorite } = await toggleFavorite(recipeId);
      if (isFavorite) {
        setFavorites([...favorites, recipeId]);
      } else {
        setFavorites(favorites.filter((id) => id !== recipeId));
      }
    } catch (error) {
      console.error("Favori ekleme/çıkarma hatası:", error);
    }
  };

  return { recipes, favorites, isLoading, error, handleFavoriteToggle };
}
