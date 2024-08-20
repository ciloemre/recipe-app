import { useState, useEffect, useCallback } from "react";
import {
  getUser,
  getUserRecipes,
  getFavorites,
  deleteRecipe,
  updateRecipe as apiUpdateRecipe,
} from "../api/api";
import { Recipe, User } from "../types/types";
import { useRecipe } from "../contexts/RecipeContext";
import { sortByCreatedAt } from "../utils/formatRecipeData";
import { useSocket } from "../hooks/useSocket";

export function useProfileData() {
  const { toggleFavoriteRecipe } = useRecipe();
  const [userData, setUserData] = useState<User | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { on, off } = useSocket();

  const fetchUserDataAndRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const [userData, recipes, favorites] = await Promise.all([
        getUser(),
        getUserRecipes(),
        getFavorites(),
      ]);

      setUserData(userData);
      setUserRecipes(recipes.sort(sortByCreatedAt));

      const initialProcessedFavorites = favorites.map((favorite) => ({
        ...favorite,
        author:
          typeof favorite.author === "string"
            ? { _id: favorite.author, username: userData.username }
            : favorite.author,
      }));

      setFavoriteRecipes(initialProcessedFavorites);
    } catch (error) {
      console.error("Error fetching user data and recipes:", error);
      setError("Kullanıcı bilgileri ve tarifleri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDataAndRecipes();
  }, [fetchUserDataAndRecipes]);

  const updateRecipe = useCallback((updatedRecipe: Recipe) => {
    setUserRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
    setFavoriteRecipes((prevFavorites) =>
      prevFavorites.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  }, []);

  const removeRecipe = useCallback((deletedRecipeId: string) => {
    setUserRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== deletedRecipeId)
    );
    setFavoriteRecipes((prevFavorites) =>
      prevFavorites.filter((recipe) => recipe._id !== deletedRecipeId)
    );
  }, []);

  useEffect(() => {
    const handleRecipeUpdate = (updatedRecipe: Recipe) => {
      updateRecipe(updatedRecipe);
    };

    const handleRecipeDelete = (deletedRecipeId: string) => {
      removeRecipe(deletedRecipeId);
    };

    on("recipeUpdated", handleRecipeUpdate);
    on("recipeDeleted", handleRecipeDelete);
    on("recipeRated", handleRecipeUpdate);
    on("commentAdded", handleRecipeUpdate);
    on("commentDeleted", handleRecipeUpdate);

    return () => {
      off("recipeUpdated", handleRecipeUpdate);
      off("recipeDeleted", handleRecipeDelete);
      off("recipeRated", handleRecipeUpdate);
      off("commentAdded", handleRecipeUpdate);
      off("commentDeleted", handleRecipeUpdate);
    };
  }, [on, off, updateRecipe, removeRecipe]);

  const handleFavoriteToggle = async (recipeId: string) => {
    await toggleFavoriteRecipe(recipeId);
    try {
      const updatedFavorites = await getFavorites();
      const updatedProcessedFavorites = updatedFavorites.map((favorite) => ({
        ...favorite,
        author:
          typeof favorite.author === "string"
            ? { _id: favorite.author, username: userData?.username || "" }
            : favorite.author,
      }));
      setFavoriteRecipes(updatedProcessedFavorites);
    } catch (error) {
      console.error("Favoriler güncellenirken hata oluştu:", error);
      setError(
        "Favoriler güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
    try {
      await deleteRecipe(recipeId);
      removeRecipe(recipeId);
    } catch (error) {
      console.error("Tarif silinirken hata oluştu:", error);
      setError("Tarif silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleEditRecipe = async (
    updatedRecipe: Partial<Recipe>
  ): Promise<void> => {
    try {
      const updated = await apiUpdateRecipe(updatedRecipe._id!, updatedRecipe);
      updateRecipe(updated);
    } catch (error) {
      console.error("Tarif güncellenirken hata oluştu:", error);
      setError("Tarif güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return {
    userData,
    userRecipes,
    favoriteRecipes,
    loading,
    error,
    handleFavoriteToggle,
    handleDeleteRecipe,
    handleEditRecipe,
    fetchUserDataAndRecipes,
    updateRecipe,
    removeRecipe,
  };
}
