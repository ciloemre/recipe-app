import { RecipeList } from "../../recipe/recipe/RecipeList";
import { Recipe } from "../../../types/types";

interface RecipePageContentProps {
  filteredRecipes: Recipe[];
  favorites: string[];
  onFavoriteToggle: (recipeId: string) => Promise<void>;
}

export function RecipePageContent({
  filteredRecipes,
  favorites,
  onFavoriteToggle,
}: RecipePageContentProps) {
  return (
    <RecipeList
      recipes={filteredRecipes}
      favorites={favorites}
      onFavoriteToggle={onFavoriteToggle}
    />
  );
}
