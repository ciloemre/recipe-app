import { RecipeFormData } from "../types/types";
import { listItemText } from "./sectionHeading";

export const validateRecipeForm = (formData: RecipeFormData): boolean => {
  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.image.trim() !== "" &&
    formData.ingredients.every((ing) => listItemText(ing) !== "") &&
    formData.instructions.every((ins) => listItemText(ins) !== "") &&
    formData.prepTime > 0 &&
    formData.cookTime >= 0 &&
    String(formData.servings).trim() !== "" &&
    formData.category !== "";

  if (!isFormValid) {
    alert("Lütfen tüm alanları doldurun.");
    return false;
  }
  return true;
};
