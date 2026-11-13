import { useState, useEffect } from "react";
import { useRecipe } from "../contexts/RecipeContext";
import { getAllRecipes, getFavorites, toggleFavorite } from "../api/api";
import { Recipe } from "../types/types";
import { useAuth } from "../contexts/AuthContext";
import { useRequireAuth } from "./useRequireAuth";

export function useRecipeData() {
  const { recipes, favorites, setRecipes, setFavorites } = useRecipe();
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const recipesData = await getAllRecipes();
        setRecipes(recipesData);

        if (user) {
          const favoritesData = await getFavorites();
          setFavorites(favoritesData.map((fav: Recipe) => fav._id));
        } else {
          setFavorites([]);
        }
        setError(null);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError(
          "Tarifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setRecipes, setFavorites, user]);

  const handleFavoriteToggle = async (recipeId: string) => {
    const allowed = requireAuth();
    if (!allowed) return;

    try {
      const { isFavorite } = await toggleFavorite(recipeId);
      if (isFavorite) {
        setFavorites([...favorites, recipeId]);
      } else {
        setFavorites(favorites.filter((id) => id !== recipeId));
      }
    } catch (err) {
      console.error("Favori ekleme/çıkarma hatası:", err);
    }
  };

  return { recipes, favorites, isLoading, error, handleFavoriteToggle };
}
