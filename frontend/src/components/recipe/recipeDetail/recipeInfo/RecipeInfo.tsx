import React from "react";
import { Stack, Divider } from "@mantine/core";
import { Recipe } from "../../../../types/types";
import { RecipeDescription } from "./RecipeDescription";
import { RecipeIngredients } from "./RecipeIngredients";
import { RecipeInstructions } from "./RecipeInstructions";
import { RecipeMetaInfo } from "./RecipeMetaInfo";

interface RecipeInfoProps {
  recipe: Recipe;
}

export const RecipeInfo: React.FC<RecipeInfoProps> = ({ recipe }) => {
  return (
    <Stack gap="xl">
      <RecipeDescription description={recipe.description} />
      <Divider />
      <RecipeIngredients ingredients={recipe.ingredients} />
      <Divider />
      <RecipeInstructions instructions={recipe.instructions} />
      <Divider />
      <RecipeMetaInfo
        prepTime={recipe.prepTime}
        cookTime={recipe.cookTime}
        servings={recipe.servings}
      />
    </Stack>
  );
};
