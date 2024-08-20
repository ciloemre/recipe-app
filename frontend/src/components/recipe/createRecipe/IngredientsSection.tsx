import { Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CustomTitle from "../../atoms/CustomTitle";
import { CustomButton } from "../../atoms/CustomButton";
import RecipeIngredientInput from "./RecipeIngredientInput";

interface IngredientsSectionProps {
  ingredients: string[];
  onArrayInputChange: (
    index: number,
    value: string,
    field: "ingredients" | "instructions"
  ) => void;
  onAddArrayItem: (field: "ingredients" | "instructions") => void;
  onRemoveArrayItem: (
    index: number,
    field: "ingredients" | "instructions"
  ) => void;
}

export function IngredientsSection({
  ingredients,
  onArrayInputChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: IngredientsSectionProps) {
  return (
    <Paper p="md" mb="md">
      <CustomTitle level={3} mb="md">
        Malzemeler
      </CustomTitle>
      {ingredients.map((ingredient: string, index: number) => (
        <RecipeIngredientInput
          key={index}
          value={ingredient}
          onChange={(value) => onArrayInputChange(index, value, "ingredients")}
          onRemove={() => onRemoveArrayItem(index, "ingredients")}
          placeholder={`Malzeme ${index + 1}`}
        />
      ))}
      <CustomButton onClick={() => onAddArrayItem("ingredients")}>
        <IconPlus size={16} style={{ marginRight: "5px" }} />
        Malzeme Ekle
      </CustomButton>
    </Paper>
  );
}
