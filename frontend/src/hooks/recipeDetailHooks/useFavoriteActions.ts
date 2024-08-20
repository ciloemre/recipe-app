import { useState, useEffect, useCallback } from "react";
import { toggleFavorite, checkIsFavorite } from "../../api/api";
import { Recipe } from "../../types/types";

export const useFavoriteActions = (recipe: Recipe | null) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (recipe) {
        try {
          const favoriteStatus = await checkIsFavorite(recipe._id);
          setIsFavorite(favoriteStatus);
        } catch (error) {
          console.error("Favori durumu kontrol edilirken hata oluştu:", error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [recipe]);

  const handleToggleFavorite = useCallback(async () => {
    if (!recipe) return;
    try {
      const { isFavorite: newFavoriteStatus } = await toggleFavorite(
        recipe._id
      );
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
      console.error("Favori durumu değiştirilirken hata oluştu:", error);
    }
  }, [recipe]);

  return { isFavorite, toggleFavorite: handleToggleFavorite };
};
