import { Grid, Text, Box } from "@mantine/core";
import { MyRecipesCard } from "../recipe/myRecipeCard/MyRecipesCard";
import { Recipe } from "../../../types/types";
import { PaginatedList } from "../../../components/recipe/PaginatedList";
import { SearchForm } from "../recipe/searchForm/SearchForm";
import { useState, useMemo } from "react";

interface MyRecipesListProps {
  recipes: Recipe[];
  onDeleteRecipe: (recipeId: string) => Promise<void>;
  onEditRecipe: (updatedRecipe: Partial<Recipe>) => Promise<void>;
}

export function MyRecipesList({
  recipes,
  onDeleteRecipe,
  onEditRecipe,
}: MyRecipesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        category === "all" || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, category]);

  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "rating") {
      }
      return 0;
    });
  }, [filteredRecipes, sortBy]);

  const handleSearch = (query: string, category: string, sortBy: string) => {
    setSearchQuery(query);
    setCategory(category);
    setSortBy(sortBy);
  };

  if (recipes.length === 0) {
    return <Text>Henüz tarif eklememişsiniz.</Text>;
  }

  return (
    <>
      <Box py="25px">
        <SearchForm onSearch={handleSearch} />
      </Box>
      <PaginatedList<Recipe>
        items={sortedRecipes}
        itemsPerPage={12}
        containerProps={{ size: "100%", p: 0 }}
        renderItems={(paginatedRecipes) => (
          <Grid gutter="lg">
            {paginatedRecipes.map((recipe) => (
              <Grid.Col
                key={recipe._id}
                span={{ base: 12, sm: 6, lg: 4, xl: 3 }}
              >
                <MyRecipesCard
                  recipe={recipe}
                  onDeleteRecipe={onDeleteRecipe}
                  onEditRecipe={onEditRecipe}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      />
    </>
  );
}
