// src/hooks/form/useRecipeForm.ts
import { useState } from "react";
import { RecipeFormData } from "../types/types";
import { applyListAction, RecipeListField } from "../utils/sectionHeading";

const initialFormData: RecipeFormData = {
  title: "",
  description: "",
  image: "",
  ingredients: [""],
  instructions: [""],
  prepTime: 0,
  cookTime: 0,
  servings: "",
  category: "",
};

export function useRecipeForm() {
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);

  const handleChange = (name: keyof RecipeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: RecipeListField
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleArrayAction = (
    action: "add" | "remove",
    field: RecipeListField,
    index?: number,
    heading?: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: applyListAction(prev[field], action, index, heading),
    }));
  };

  return {
    formData,
    handleChange,
    handleArrayChange,
    handleArrayAction,
    setFormData,
  };
}
