import { useRecipe } from "../contexts/RecipeContext";
import { useRequireAuth } from "./useRequireAuth";

export function useRecipeData() {
  const { recipes, favorites, loading, error, toggleFavoriteRecipe } =
    useRecipe();
  const { requireAuth } = useRequireAuth();

  const handleFavoriteToggle = async (recipeId: string) => {
    const allowed = requireAuth();
    if (!allowed) return;

    try {
      await toggleFavoriteRecipe(recipeId);
    } catch (err) {
      console.error("Favori ekleme/çıkarma hatası:", err);
    }
  };

  return {
    recipes,
    favorites,
    isLoading: loading && recipes.length === 0,
    error: recipes.length === 0 ? error : null,
    handleFavoriteToggle,
  };
}
