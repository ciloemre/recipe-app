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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [recipesData, favoritesData] = await Promise.all([
        getAllRecipes(),
        getFavorites(),
      ]);
      console.log("Fetched recipes:", recipesData);
      setRecipes(recipesData);
      setFavorites(favoritesData.map((fav: Recipe) => fav._id));
    } catch (error) {
      console.error("Data fetching error:", error);
      setError("An error occurred while loading the data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isConnected) {
      fetchData();

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
        setFavorites((prev) =>
          isFavorite
            ? [...prev, recipeId]
            : prev.filter((id) => id !== recipeId)
        );
      };

      on("recipeAdded", handleNewRecipe);
      on("recipeUpdated", handleUpdatedRecipe);
      on("recipeDeleted", handleDeletedRecipe);
      on("favoriteToggled", handleFavoriteToggled);

      return () => {
        off("recipeAdded", handleNewRecipe);
        off("recipeUpdated", handleUpdatedRecipe);
        off("recipeDeleted", handleDeletedRecipe);
        off("favoriteToggled", handleFavoriteToggled);
      };
    }
  }, [user, on, off, fetchData, isConnected]);

  const toggleFavoriteRecipe = async (recipeId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { isFavorite } = await toggleFavorite(recipeId);
      setFavorites((prev) =>
        isFavorite ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
      return isFavorite;
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      setError("An error occurred while updating favorite status");
      throw error;
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
