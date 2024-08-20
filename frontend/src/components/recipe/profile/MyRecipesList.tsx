// src/components/MyRecipesList.tsx
import { Grid, Text } from "@mantine/core";
import { MyRecipesCard } from "../recipe/myRecipeCard/MyRecipesCard";
import { Recipe } from "../../../types/types";
import { PaginatedList } from "../../../components/recipe/PaginatedList";

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
  if (recipes.length === 0) {
    return <Text>Henüz tarif eklememişsiniz.</Text>;
  }

  return (
    <PaginatedList<Recipe>
      items={recipes}
      itemsPerPage={12}
      containerProps={{ size: "100%", p: 0 }}
      renderItems={(paginatedRecipes) => (
        <Grid gutter="lg">
          {paginatedRecipes.map((recipe) => (
            <Grid.Col key={recipe._id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
  );
}
