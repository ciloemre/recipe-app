import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../../types/types";
import { getRecipeById } from "../../api/api";
import { useRecipe } from "../../contexts/RecipeContext";

function recipePreview(recipe: Recipe): Recipe {
  const comments = Array.isArray(recipe.comments)
    ? recipe.comments.filter(
        (comment) => comment?.user && typeof comment.user === "object"
      )
    : [];
  return { ...recipe, comments };
}

export const useRecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { recipes, updateRecipeInState } = useRecipe();
  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;
  const cachedOnOpen = recipes.find((item) => item._id === id) ?? null;
  const [recipe, setRecipe] = useState<Recipe | null>(
    cachedOnOpen ? recipePreview(cachedOnOpen) : null
  );
  const [isLoading, setIsLoading] = useState(!cachedOnOpen);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (!id) return;

    const cached =
      recipesRef.current.find((item) => item._id === id) ?? null;

    if (cached) {
      setRecipe((current) =>
        current?._id === id ? current : recipePreview(cached)
      );
      setIsLoading(false);
    } else {
      setRecipe(null);
      setIsLoading(true);
    }

    try {
      const fetchedRecipe = await getRecipeById(id);
      setRecipe(fetchedRecipe);
      updateRecipeInState({
        ...fetchedRecipe,
        comments: [],
        ratings: [],
        commentCount: fetchedRecipe.comments?.length ?? 0,
        ratingCount: fetchedRecipe.ratings?.length ?? 0,
      });
      setError(null);
    } catch (err) {
      if (!cached) {
        setError("Tarif yüklenirken bir hata oluştu.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, updateRecipeInState]);

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
