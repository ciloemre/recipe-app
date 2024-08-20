import { useState } from "react";
import { createRecipe } from "../api/api";
import { RecipeFormData } from "../types/types";

export const useCreateRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewRecipe = async (
    recipeData: RecipeFormData & { author: string }
  ) => {
    setIsLoading(true);
    try {
      const { author, ...restRecipeData } = recipeData;
      const createdRecipe = await createRecipe({
        ...restRecipeData,
        authorId: author, // Burada author'u authorId olarak kullanıyoruz
        authorName: author, // Burada author'u authorName olarak da kullanıyoruz
      });
      return createdRecipe;
    } catch (err: unknown) {
      let errorMessage =
        "Tarif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createNewRecipe, isLoading };
};
