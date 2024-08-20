import React from "react";
import { Space, Flex } from "@mantine/core";
import { RecipeHero } from "../components/recipe/recipe/RecipeHero";
import { RecipeList } from "../components/recipe/recipe/RecipeList";
import { RecipeLoading } from "../components/recipe/recipe/RecipeLoading";
import { RecipeError } from "../components/recipe/recipe/RecipeError";
import { useRecipeData } from "../hooks/useRecipeData";
import { useRecipeFiltering } from "../hooks/useRecipeFiltering";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";

const RecipePage: React.FC = () => {
  const { recipes, favorites, isLoading, error, handleFavoriteToggle } =
    useRecipeData();
  const { filteredRecipes, handleSearch } = useRecipeFiltering(recipes);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.newRecipeAdded) {
      notifications.show({
        title: "Başarılı",
        message: "Tarif başarıyla oluşturuldu.",
        color: "green",
        icon: <IconCheck size="1.1rem" />,
        autoClose: 3000,
      });
      history.replaceState({}, document.title);
    }
  }, [location]);

  if (isLoading) return <RecipeLoading />;
  if (error) return <RecipeError message={error} />;

  return (
    <Flex direction="column">
      <RecipeHero onSearch={handleSearch} />
      <Space h="xl" />
      <RecipeList
        recipes={filteredRecipes}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </Flex>
  );
};

export default RecipePage;
