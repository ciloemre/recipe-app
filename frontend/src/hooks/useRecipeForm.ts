// src/hooks/form/useRecipeForm.ts
import { useState } from "react";
import { RecipeFormData } from "../types/types";

const initialFormData: RecipeFormData = {
  title: "",
  description: "",
  image: "",
  ingredients: [""],
  instructions: [""],
  prepTime: 0,
  cookTime: 0,
  servings: 1,
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
    field: "ingredients" | "instructions"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleArrayAction = (
    action: "add" | "remove",
    field: "ingredients" | "instructions",
    index?: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        action === "add"
          ? [...prev[field], ""]
          : prev[field].filter((_, i) => i !== index),
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
