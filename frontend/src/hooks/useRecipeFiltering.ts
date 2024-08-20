import { useState, useCallback, useEffect } from "react";
import { Recipe } from "../types/types";

export function useRecipeFiltering(recipes: Recipe[]) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filterRecipes = useCallback(
    (recipes: Recipe[]) => {
      return recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (category === "all" || recipe.category === category)
      );
    },
    [searchQuery, category]
  );

  const sortRecipes = useCallback(
    (recipes: Recipe[]) => {
      return [...recipes].sort((a, b) => {
        if (sortBy === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === "rating") {
          return (b.averageRating ?? 0) - (a.averageRating ?? 0);
        }
        return 0;
      });
    },
    [sortBy]
  );

  const handleSearch = (query: string, cat: string, sort: string) => {
    setSearchQuery(query);
    setCategory(cat);
    setSortBy(sort);
  };

  useEffect(() => {
    const filteredAndSortedRecipes = sortRecipes(filterRecipes(recipes));
    setFilteredRecipes(filteredAndSortedRecipes);
  }, [recipes, filterRecipes, sortRecipes]);

  return { filteredRecipes, handleSearch };
}
