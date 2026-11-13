import { useState, useEffect, useCallback } from "react";
import { toggleFavorite, checkIsFavorite } from "../../api/api";
import { Recipe } from "../../types/types";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../useRequireAuth";

export const useFavoriteActions = (recipe: Recipe | null) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!recipe || !user) {
        setIsFavorite(false);
        return;
      }
      try {
        const favoriteStatus = await checkIsFavorite(recipe._id);
        setIsFavorite(favoriteStatus);
      } catch (error) {
        console.error("Favori durumu kontrol edilirken hata oluştu:", error);
      }
    };

    fetchFavoriteStatus();
  }, [recipe, user]);

  const handleToggleFavorite = useCallback(async (): Promise<boolean> => {
    if (!recipe) return false;

    const allowed = requireAuth();
    if (!allowed) return false;

    try {
      const { isFavorite: newFavoriteStatus } = await toggleFavorite(
        recipe._id
      );
      setIsFavorite(newFavoriteStatus);
      return true;
    } catch (error) {
      console.error("Favori durumu değiştirilirken hata oluştu:", error);
      return false;
    }
  }, [recipe, requireAuth]);

  return { isFavorite, toggleFavorite: handleToggleFavorite };
};
