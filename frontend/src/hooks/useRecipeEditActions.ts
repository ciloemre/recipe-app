import { useNavigate } from "react-router-dom";
import { updateRecipe, deleteRecipe } from "../api/api";
import { Recipe } from "../types/types";

export const useRecipeEditActions = (
  recipe: Recipe | null,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();

  const handleEditSubmit = async (updatedRecipe: Partial<Recipe>) => {
    if (!recipe) return;
    try {
      const updated = await updateRecipe(recipe._id, updatedRecipe);
      setRecipe((prevRecipe) =>
        prevRecipe
          ? {
              ...prevRecipe,
              ...updated,
              author: prevRecipe.author,
            }
          : null
      );
    } catch (error) {
      console.error("Tarif güncellenirken hata oluştu:", error);
      setError("Tarif güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDeleteClick = async () => {
    if (!recipe) return;
    try {
      await deleteRecipe(recipe._id);
      navigate("/recipes");
    } catch (error) {
      console.error("Tarif silinirken hata oluştu:", error);
      setError("Tarif silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return { handleEditSubmit, handleDeleteClick };
};
