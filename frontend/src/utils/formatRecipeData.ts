import { Recipe, RecipeFormData } from "../types/types";

export function sortByCreatedAt(a: Recipe, b: Recipe) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export const formatRecipeData = (formData: RecipeFormData, author: string) => {
  return {
    ...formData,
    author,
    prepTime: Number(formData.prepTime),
    cookTime: Number(formData.cookTime),
    servings: Number(formData.servings),
  };
};
