import { RecipeFormData } from "../types/types";

export const validateRecipeForm = (formData: RecipeFormData): boolean => {
  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.image.trim() !== "" &&
    formData.ingredients.every((ing) => ing.trim() !== "") &&
    formData.instructions.every((ins) => ins.trim() !== "") &&
    formData.prepTime > 0 &&
    formData.cookTime >= 0 &&
    formData.servings > 0 &&
    formData.category !== "";

  if (!isFormValid) {
    alert("Lütfen tüm alanları doldurun.");
    return false;
  }
  return true;
};
