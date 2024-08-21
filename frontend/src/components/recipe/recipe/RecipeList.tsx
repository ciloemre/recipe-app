import { useEffect, useState } from "react";
import { SimpleGrid, Container, Box } from "@mantine/core";
import { RecipeCard } from "./recipeCard/RecipeCard";
import { Recipe } from "../../../types/types";
import styles from "./RecipeList.module.css";
import { useSocket } from "../../../hooks/useSocket";
import { PaginatedList } from "../../../components/recipe/PaginatedList";

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
  const [recipes, setRecipes] = useState(initialRecipes);
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
        <div className={styles.noRecipeMessage}>Hiç tarif bulunamadı.</div>
      </Container>
    );
  }

  return (
    <Box py="lg">
      <PaginatedList
        items={recipes}
        itemsPerPage={12}
        containerProps={{ size: "90%", px: "xs" }}
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
