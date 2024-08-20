import { useState } from "react";
import { Recipe } from "../../types/types";
import { useRecipeEditActions } from "../useRecipeEditActions";

export const useRecipeEdit = (
  recipe: Recipe | null,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  initialEditMode: boolean = false
) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const { handleEditSubmit: editSubmit, handleDeleteClick } =
    useRecipeEditActions(recipe, setRecipe, setError);

  const handleEditSubmit = (updatedRecipe: Partial<Recipe>) => {
    editSubmit(updatedRecipe);
    setIsEditing(false);
  };

  const handleEditClick = (value: boolean) => setIsEditing(value);

  return { isEditing, handleEditSubmit, handleEditClick, handleDeleteClick };
};
