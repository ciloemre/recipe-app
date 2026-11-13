import { useCallback } from "react";
import { rateRecipe } from "../../api/api";
import { Recipe } from "../../types/types";
import { useRequireAuth } from "../useRequireAuth";

export const useRatingActions = (
  recipe: Recipe | null,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { requireAuth } = useRequireAuth();

  const handleRating = useCallback(
    async (value: number) => {
      if (!recipe) return;

      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updatedRecipe = await rateRecipe(recipe._id, value);
        setRecipe(updatedRecipe);
      } catch (error) {
        console.error("Derecelendirme hatası:", error);
        setError(
          "Derecelendirme sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    },
    [recipe, setRecipe, setError, requireAuth]
  );

  return { handleRating };
};
