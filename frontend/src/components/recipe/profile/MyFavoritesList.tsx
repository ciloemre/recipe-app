// src/components/MyFavoritesList.tsx
import { useEffect } from "react";
import { SimpleGrid, Text } from "@mantine/core";
import { RecipeCard } from "../recipe/recipeCard/RecipeCard";
import { Recipe } from "../../../types/types";
import { useSocket } from "../../../hooks/useSocket";
import { useProfileData } from "../../../hooks/useProfileData";
import { PaginatedList } from "../../../components/recipe/PaginatedList";

interface MyFavoritesListProps {
  onFavoriteToggle: (recipeId: string) => void;
}

export function MyFavoritesList({ onFavoriteToggle }: MyFavoritesListProps) {
  const { favoriteRecipes, updateRecipe } = useProfileData();
  const { on, off } = useSocket();

  useEffect(() => {
    const handleRecipeUpdate = (updatedRecipe: Recipe) => {
      updateRecipe(updatedRecipe);
    };

    on("recipeRated", handleRecipeUpdate);
    on("commentAdded", handleRecipeUpdate);
    on("commentDeleted", handleRecipeUpdate);

    return () => {
      off("recipeRated", handleRecipeUpdate);
      off("commentAdded", handleRecipeUpdate);
      off("commentDeleted", handleRecipeUpdate);
    };
  }, [on, off, updateRecipe]);

  if (favoriteRecipes.length === 0) {
    return <Text>Henüz favori tarif eklememişsiniz.</Text>;
  }

  return (
    <PaginatedList<Recipe>
      items={favoriteRecipes}
      itemsPerPage={12}
      containerProps={{ size: "100%", p: 0 }}
      renderItems={(paginatedFavorites) => (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="lg"
          verticalSpacing="xl"
        >
          {paginatedFavorites.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={true}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </SimpleGrid>
      )}
    />
  );
}
