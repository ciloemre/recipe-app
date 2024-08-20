import { useCallback } from "react";
import { rateRecipe } from "../../api/api";
import { Recipe } from "../../types/types";

export const useRatingActions = (
  recipe: Recipe | null,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleRating = useCallback(
    async (value: number) => {
      if (!recipe) return;
      try {
        const updatedRecipe = await rateRecipe(recipe._id, value);
        setRecipe(updatedRecipe);
        // emit işlemi kaldırıldı
      } catch (error) {
        console.error("Derecelendirme hatası:", error);
        setError(
          "Derecelendirme sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    },
    [recipe, setRecipe, setError]
  );

  return { handleRating };
};
