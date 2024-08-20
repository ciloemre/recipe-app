import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../../types/types";
import { getRecipeById } from "../../api/api";

export const useRecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (id) {
      try {
        setIsLoading(true);
        const fetchedRecipe = await getRecipeById(id);
        setRecipe(fetchedRecipe);
      } catch (err) {
        setError("Tarif yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const refreshRecipe = useCallback(async () => {
    if (id) {
      try {
        const fetchedRecipe = await getRecipeById(id);
        setRecipe((prev) => ({ ...prev, ...fetchedRecipe }));
      } catch (err) {
        setError("Tarif yüklenirken bir hata oluştu.");
        console.error(err);
      }
    }
  }, [id]);

  return { recipe, isLoading, error, setRecipe, setError, refreshRecipe };
};
