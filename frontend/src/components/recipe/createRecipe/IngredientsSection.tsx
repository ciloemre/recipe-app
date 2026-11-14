import { Group, Paper } from "@mantine/core";
import { IconHeading, IconPlus } from "@tabler/icons-react";
import CustomTitle from "../../atoms/CustomTitle";
import { CustomButton } from "../../atoms/CustomButton";
import RecipeIngredientInput from "./RecipeIngredientInput";
import {
  AddListItemOptions,
  isSectionHeading,
  RecipeListField,
  sectionHeadingText,
  toSectionHeading,
} from "../../../utils/sectionHeading";

interface IngredientsSectionProps {
  ingredients: string[];
  onArrayInputChange: (
    index: number,
    value: string,
    field: RecipeListField
  ) => void;
  onAddArrayItem: (field: RecipeListField, options?: AddListItemOptions) => void;
  onRemoveArrayItem: (index: number, field: RecipeListField) => void;
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
      {ingredients.map((ingredient: string, index: number) => {
        const heading = isSectionHeading(ingredient);
        return (
          <RecipeIngredientInput
            key={index}
            value={heading ? sectionHeadingText(ingredient) : ingredient}
            isHeading={heading}
            onChange={(value) =>
              onArrayInputChange(
                index,
                heading ? toSectionHeading(value) : value,
                "ingredients"
              )
            }
            onInsertHeading={() =>
              onAddArrayItem("ingredients", { index: index + 1, heading: true })
            }
            onRemove={() => onRemoveArrayItem(index, "ingredients")}
            placeholder={`Malzeme ${index + 1}`}
          />
        );
      })}
      <Group gap="sm">
        <CustomButton onClick={() => onAddArrayItem("ingredients")}>
          <IconPlus size={16} style={{ marginRight: "5px" }} />
          Malzeme Ekle
        </CustomButton>
        <CustomButton
          variant="light"
          onClick={() => onAddArrayItem("ingredients", { heading: true })}
        >
          <IconHeading size={16} style={{ marginRight: "5px" }} />
          Başlık Ekle
        </CustomButton>
      </Group>
    </Paper>
  );
}
