import { useState, useEffect, useCallback } from "react";
import {
  getUser,
  getUserRecipes,
  getFavorites,
  deleteRecipe,
  updateRecipe as apiUpdateRecipe,
} from "../api/api";
import { Recipe, User } from "../types/types";
import { sortByCreatedAt } from "../utils/formatRecipeData";
import { useSocket } from "../hooks/useSocket";

export function useProfileData() {
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

      const processedFavorites = favorites.map((favorite) => ({
        ...favorite,
        author:
          typeof favorite.author === "string"
            ? { _id: favorite.author, username: userData.username }
            : favorite.author,
      }));

      setFavoriteRecipes(processedFavorites);
      setError(null);
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
    const updateRecipeList = (prevRecipes: Recipe[]) =>
      prevRecipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      );

    setUserRecipes(updateRecipeList);
    setFavoriteRecipes(updateRecipeList);
  }, []);

  const removeRecipe = useCallback((deletedRecipeId: string) => {
    const filterRecipes = (recipes: Recipe[]) =>
      recipes.filter((recipe) => recipe._id !== deletedRecipeId);

    setUserRecipes(filterRecipes);
    setFavoriteRecipes(filterRecipes);
  }, []);

  useEffect(() => {
    fetchUserDataAndRecipes();
  }, [fetchUserDataAndRecipes]);

  useEffect(() => {
    const handleRecipeUpdate = (updatedRecipe: Recipe) => {
      updateRecipe(updatedRecipe);
    };

    const handleRecipeDelete = (deletedRecipeId: string) => {
      removeRecipe(deletedRecipeId);
    };

    const events = [
      "recipeUpdated",
      "recipeDeleted",
      "recipeRated",
      "commentAdded",
      "commentDeleted",
    ];

    events.forEach((event) => {
      on(
        event,
        event === "recipeDeleted" ? handleRecipeDelete : handleRecipeUpdate
      );
    });

    return () => {
      events.forEach((event) => {
        off(
          event,
          event === "recipeDeleted" ? handleRecipeDelete : handleRecipeUpdate
        );
      });
    };
  }, [on, off, updateRecipe, removeRecipe]);

  const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
    try {
      await deleteRecipe(recipeId);
      removeRecipe(recipeId);
      setError(null);
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
      setError(null);
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
    handleDeleteRecipe,
    handleEditRecipe,
    fetchUserDataAndRecipes,
    updateRecipe,
    removeRecipe,
  };
}
