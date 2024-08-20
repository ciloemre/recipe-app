import { useState, useEffect, useCallback } from "react";
import { Text, SimpleGrid, Container, Box, Space } from "@mantine/core";
import { RecipeCard } from "../components/recipe/recipe/recipeCard/RecipeCard";
import { SearchForm } from "../components/recipe/recipe/searchForm/SearchForm";
import CustomTitle from "../components/atoms/CustomTitle";
import { Recipe } from "../types/types";
import { useRecipe } from "../contexts/RecipeContext";

export function FavoritesPage() {
  const { recipes, favorites, toggleFavoriteRecipe } = useRecipe();
  const [filteredFavorites, setFilteredFavorites] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const getFavoriteRecipes = useCallback(() => {
    return recipes.filter((recipe) => favorites.includes(recipe._id));
  }, [recipes, favorites]);

  const filterAndSortRecipes = useCallback(
    (recipesToFilter: Recipe[]) => {
      let filtered = recipesToFilter.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (category === "all" || recipe.category === category)
      );

      if (sortBy === "rating") {
        filtered.sort(
          (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
        );
      } else if (sortBy === "newest") {
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      return filtered;
    },
    [searchQuery, category, sortBy]
  );

  useEffect(() => {
    const favoriteRecipes = getFavoriteRecipes();
    const filteredAndSortedRecipes = filterAndSortRecipes(favoriteRecipes);
    setFilteredFavorites(filteredAndSortedRecipes);
  }, [getFavoriteRecipes, filterAndSortRecipes]);

  const handleToggleFavorite = async (recipeId: string) => {
    await toggleFavoriteRecipe(recipeId);
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
        <Box style={{ position: "relative", marginBottom: "2rem" }}>
          <CustomTitle level={2}>Favoriler</CustomTitle>
        </Box>
        <Text>Henüz favori tarifiniz yok.</Text>
      </Container>
    );
  }

  return (
    <Container mt={40} size="xl">
      <Box style={{ position: "relative", marginBottom: "2rem" }}>
        <CustomTitle level={2}>Favoriler</CustomTitle>
      </Box>
      <SearchForm onSearch={handleSearch} />
      <Space h="md" />
      {filteredFavorites.length === 0 ? (
        <Text>Bu kriterlere uyan favori tarif bulunamadı.</Text>
      ) : (
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 3, md: 4 }}
          spacing="md"
          verticalSpacing="xl"
        >
          {filteredFavorites.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={true}
              onFavoriteToggle={() => handleToggleFavorite(recipe._id)}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default FavoritesPage;
