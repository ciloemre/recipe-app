import { useState, useEffect, useCallback } from "react";
import {
  getUserRecipes,
  deleteRecipe,
  updateRecipe as apiUpdateRecipe,
} from "../api/api";
import { Recipe, User } from "../types/types";
import { sortByCreatedAt } from "../utils/formatRecipeData";
import { useSocket } from "./useSocket";
import { patchRecipeWithUser, UserUpdate } from "../utils/patchUser";
import { useAuth } from "../contexts/AuthContext";
import { useRecipe } from "../contexts/RecipeContext";

export function useProfileData() {
  const { user } = useAuth();
  const { deleteRecipeFromState, updateRecipeInState } = useRecipe();
  const [userData, setUserData] = useState<User | null>(user);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);
  const { on, off } = useSocket();

  useEffect(() => {
    if (user) {
      setUserData(user);
      setLoading(false);
    }
  }, [user]);

  const fetchUserDataAndRecipes = useCallback(async () => {
    try {
      const recipes = await getUserRecipes();
      setUserRecipes(recipes.sort(sortByCreatedAt));
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

  const updateRecipe = useCallback(
    (updatedRecipe: Recipe) => {
      setUserRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        )
      );
      updateRecipeInState(updatedRecipe);
    },
    [updateRecipeInState]
  );

  const removeRecipe = useCallback(
    (deletedRecipeId: string) => {
      setUserRecipes((recipes) =>
        recipes.filter((recipe) => recipe._id !== deletedRecipeId)
      );
      deleteRecipeFromState(deletedRecipeId);
    },
    [deleteRecipeFromState]
  );

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

    const handleUserUpdated = (update: UserUpdate) => {
      setUserRecipes((recipes) =>
        recipes.map((recipe) => patchRecipeWithUser(recipe, update))
      );
      setUserData((prev) => {
        if (!prev || prev._id !== update._id) return prev;
        return {
          ...prev,
          name: update.name,
          username: update.username,
          avatar: update.avatar || prev.avatar,
        };
      });
    };

    events.forEach((event) => {
      on(
        event,
        event === "recipeDeleted" ? handleRecipeDelete : handleRecipeUpdate
      );
    });
    on("userUpdated", handleUserUpdated);

    return () => {
      events.forEach((event) => {
        off(
          event,
          event === "recipeDeleted" ? handleRecipeDelete : handleRecipeUpdate
        );
      });
      off("userUpdated", handleUserUpdated);
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
    favoriteRecipes: [] as Recipe[],
    loading: loading && !userData,
    error,
    handleDeleteRecipe,
    handleEditRecipe,
    fetchUserDataAndRecipes,
    updateRecipe,
    removeRecipe,
    setUserData,
  };
}
