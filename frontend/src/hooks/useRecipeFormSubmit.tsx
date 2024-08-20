import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRecipe } from "../contexts/RecipeContext";
import { useRecipeForm } from "./useRecipeForm";
import { useCreateRecipe } from "./useCreateRecipe";
import { validateRecipeForm } from "../utils/validateRecipeForm";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { Recipe } from "../types/types";
import { useSocket } from "./useSocket";

export function useRecipeFormSubmit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setRecipes } = useRecipe();
  const { formData, handleChange, handleArrayChange, handleArrayAction } =
    useRecipeForm();
  const { createNewRecipe, isLoading } = useCreateRecipe();
  const { emit } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRecipeForm(formData)) return;
    if (!user) {
      notifications.show({
        title: "Error",
        message: "You must be logged in to create a recipe.",
        color: "red",
        icon: <IconX size="1.1rem" />,
      });
      navigate("/login");
      return;
    }
    try {
      const newRecipeData = { ...formData, author: user.username };
      const createdRecipe: Recipe = await createNewRecipe(newRecipeData);
      setRecipes((prevRecipes: Recipe[]) => [...prevRecipes, createdRecipe]);
      emit("newRecipe", createdRecipe);

      navigate("/recipes", { state: { newRecipeAdded: true } });
    } catch (error) {
      console.error("Error creating recipe:", error);
      notifications.show({
        title: "Error",
        message:
          "An error occurred while creating the recipe. Please try again.",
        color: "red",
        icon: <IconX size="1.1rem" />,
      });
    }
  };

  return {
    formData,
    handleChange,
    handleArrayChange,
    handleArrayAction,
    handleSubmit,
    isLoading,
  };
}
