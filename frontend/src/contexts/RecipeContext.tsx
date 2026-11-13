import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Recipe } from "../types/types";
import { getAllRecipes, getFavorites, toggleFavorite } from "../api/api";
import { useAuth } from "./AuthContext";
import { useSocket } from "../hooks/useSocket";
import { patchRecipeWithUser, UserUpdate } from "../utils/patchUser";

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  toggleFavoriteRecipe: (recipeId: string) => Promise<boolean>;
  updateRecipeInState: (updatedRecipe: Recipe) => void;
  deleteRecipeFromState: (recipeId: string) => void;
  updateFavoriteStatus: (recipeId: string, isFavorite: boolean) => void;
  loading: boolean;
  error: string | null;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { on, off, isConnected } = useSocket();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const recipesData = await getAllRecipes();
      setRecipes(recipesData);
    } catch (err) {
      console.error("Recipe fetch error:", err);
      setError("An error occurred while loading the data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData.map((fav: Recipe) => fav._id));
    } catch (err) {
      console.error("Favorites fetch error:", err);
      setFavorites([]);
    }
  }, [user]);

  // Public read: load recipes for everyone (guests + authenticated)
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    if (!isConnected) return;

    const handleNewRecipe = (newRecipe: Recipe) => {
      setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
    };

    const handleUpdatedRecipe = (updatedRecipe: Recipe) => {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        )
      );
    };

    const handleDeletedRecipe = (deletedRecipeId: string) => {
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== deletedRecipeId)
      );
    };

    const handleFavoriteToggled = ({
      recipeId,
      isFavorite,
    }: {
      recipeId: string;
      isFavorite: boolean;
    }) => {
      if (!user) return;
      setFavorites((prev) =>
        isFavorite
          ? [...prev, recipeId]
          : prev.filter((id) => id !== recipeId)
      );
    };

    const handleUserUpdated = (update: UserUpdate) => {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => patchRecipeWithUser(recipe, update))
      );
    };

    on("recipeAdded", handleNewRecipe);
    on("recipeUpdated", handleUpdatedRecipe);
    on("recipeDeleted", handleDeletedRecipe);
    on("favoriteToggled", handleFavoriteToggled);
    on("userUpdated", handleUserUpdated);

    return () => {
      off("recipeAdded", handleNewRecipe);
      off("recipeUpdated", handleUpdatedRecipe);
      off("recipeDeleted", handleDeletedRecipe);
      off("favoriteToggled", handleFavoriteToggled);
      off("userUpdated", handleUserUpdated);
    };
  }, [user, on, off, isConnected]);

  const toggleFavoriteRecipe = async (recipeId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { isFavorite } = await toggleFavorite(recipeId);
      setFavorites((prev) =>
        isFavorite ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
      return isFavorite;
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      setError("An error occurred while updating favorite status");
      throw err;
    }
  };

  const updateRecipeInState = useCallback((updatedRecipe: Recipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  }, []);

  const deleteRecipeFromState = useCallback((recipeId: string) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  }, []);

  const updateFavoriteStatus = useCallback(
    (recipeId: string, isFavorite: boolean) => {
      setFavorites((prev) =>
        isFavorite ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
    },
    []
  );

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        setRecipes,
        setFavorites,
        toggleFavoriteRecipe,
        updateRecipeInState,
        deleteRecipeFromState,
        updateFavoriteStatus,
        loading,
        error,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};
