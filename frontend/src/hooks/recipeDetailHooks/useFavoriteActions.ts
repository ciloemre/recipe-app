import { useCallback } from "react";
import { toggleFavorite } from "../../api/api";
import { Recipe } from "../../types/types";
import { useRequireAuth } from "../useRequireAuth";
import { useRecipe } from "../../contexts/RecipeContext";

export const useFavoriteActions = (recipe: Recipe | null) => {
  const { favorites, updateFavoriteStatus } = useRecipe();
  const { requireAuth } = useRequireAuth();
  const isFavorite = Boolean(recipe && favorites.includes(recipe._id));

  const handleToggleFavorite = useCallback(async (): Promise<boolean> => {
    if (!recipe) return false;

    const allowed = requireAuth();
    if (!allowed) return false;

    try {
      const { isFavorite: newFavoriteStatus } = await toggleFavorite(
        recipe._id
      );
      updateFavoriteStatus(recipe._id, newFavoriteStatus);
      return true;
    } catch (error) {
      console.error("Favori durumu değiştirilirken hata oluştu:", error);
      return false;
    }
  }, [recipe, requireAuth, updateFavoriteStatus]);

  return { isFavorite, toggleFavorite: handleToggleFavorite };
};
