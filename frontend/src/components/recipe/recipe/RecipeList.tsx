import { useEffect, useState } from "react";
import { SimpleGrid, Container, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { RecipeCard } from "./recipeCard/RecipeCard";
import { Recipe } from "../../../types/types";
import styles from "./RecipeList.module.css";
import { useSocket } from "../../../hooks/useSocket";
import { PaginatedList } from "../../../components/recipe/PaginatedList";
import { useTranslatedRecipes } from "../../../hooks/useTranslatedRecipes";

interface RecipeListProps {
  recipes: Recipe[];
  favorites: string[];
  onFavoriteToggle: (recipeId: string) => void;
}

export function RecipeList({
  recipes: initialRecipes,
  favorites,
  onFavoriteToggle,
}: RecipeListProps) {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState(initialRecipes);
  const displayRecipes = useTranslatedRecipes(recipes);
  const { on, off } = useSocket();

  useEffect(() => {
    const handleRatingUpdate = (data: {
      recipeId: string;
      averageRating: number;
      ratingCount: number;
    }) => {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === data.recipeId
            ? {
                ...recipe,
                averageRating: data.averageRating,
                ratings: Array(data.ratingCount),
              }
            : recipe
        )
      );
    };

    const handleCommentUpdate = (data: {
      recipeId: string;
      commentCount: number;
    }) => {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === data.recipeId
            ? { ...recipe, comments: Array(data.commentCount) }
            : recipe
        )
      );
    };

    on("recipeRated", handleRatingUpdate);
    on("commentAdded", handleCommentUpdate);
    on("commentDeleted", handleCommentUpdate);

    return () => {
      off("recipeRated", handleRatingUpdate);
      off("commentAdded", handleCommentUpdate);
      off("commentDeleted", handleCommentUpdate);
    };
  }, [on, off]);

  useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes]);
  if (recipes.length === 0) {
    return (
      <Container size="xl" px="xs">
        <div className={styles.noRecipeMessage}>{t("recipes.noneFound")}</div>
      </Container>
    );
  }

  return (
    <Box py="lg">
      <PaginatedList
        items={displayRecipes}
        itemsPerPage={12}
        containerProps={{
          size: "xl",
          px: { base: "xs", sm: "md" },
        }}
        renderItems={(paginatedRecipes) => (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: "sm", sm: "lg" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {paginatedRecipes.map((recipe, index) => (
              <RecipeCard
                key={`${recipe._id}-${index}`}
                recipe={recipe}
                isFavorite={favorites.includes(recipe._id)}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </SimpleGrid>
        )}
      />
    </Box>
  );
}
