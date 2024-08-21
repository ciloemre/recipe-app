import { useState, useCallback, useMemo } from "react";
import { Text, SimpleGrid, Container, Box } from "@mantine/core";
import { RecipeCard } from "../components/recipe/recipe/recipeCard/RecipeCard";
import { SearchForm } from "../components/recipe/recipe/searchForm/SearchForm";
import { Recipe } from "../types/types";
import { useRecipe } from "../contexts/RecipeContext";
import { PaginatedList } from "../components/recipe/PaginatedList";

export function FavoritesPage() {
  const { recipes, favorites, toggleFavoriteRecipe, updateFavoriteStatus } =
    useRecipe();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const getFavoriteRecipes = useCallback(() => {
    return recipes.filter((recipe) => favorites.includes(recipe._id));
  }, [recipes, favorites]);

  const filteredFavorites = useMemo(() => {
    const favoriteRecipes = getFavoriteRecipes();
    return favoriteRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        category === "all" || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [getFavoriteRecipes, searchQuery, category]);

  const sortedFavorites = useMemo(() => {
    return [...filteredFavorites].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "rating") {
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      }
      return 0;
    });
  }, [filteredFavorites, sortBy]);

  const handleToggleFavorite = async (recipeId: string) => {
    try {
      const isFavorite = await toggleFavoriteRecipe(recipeId);
      updateFavoriteStatus(recipeId, isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleSearch = (query: string, cat: string, sort: string) => {
    setSearchQuery(query);
    setCategory(cat);
    setSortBy(sort);
  };

  const favoriteRecipes = getFavoriteRecipes();

  if (favoriteRecipes.length === 0) {
    return (
      <Container mt={40} size="xl">
        <Text>Henüz favori tarifiniz yok.</Text>
      </Container>
    );
  }

  return (
    <Container p={0} size="100%">
      <Box py="25px">
        <SearchForm onSearch={handleSearch} />
      </Box>
      {sortedFavorites.length === 0 ? (
        <Text>Bu kriterlere uyan favori tarif bulunamadı.</Text>
      ) : (
        <PaginatedList<Recipe>
          items={sortedFavorites}
          itemsPerPage={12}
          containerProps={{ size: "100%", p: 0 }}
          renderItems={(paginatedFavorites) => (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
              spacing="lg"
              verticalSpacing="xl"
            >
              {paginatedFavorites.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  isFavorite={true}
                  onFavoriteToggle={() => handleToggleFavorite(recipe._id)}
                />
              ))}
            </SimpleGrid>
          )}
        />
      )}
    </Container>
  );
}

export default FavoritesPage;
