import { Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";
import CustomTitle from "../../atoms/CustomTitle";
import RecipeIngredientInput from "./RecipeIngredientInput";
import { ListAddButtons } from "./ListRowActions";
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
  const { t } = useTranslation();

  return (
    <Paper p={{ base: "sm", sm: "md" }} mb="md">
      <CustomTitle level={3} mb="md">
        {t("create.ingredients")}
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
            placeholder={t("create.ingredientPlaceholder", { n: index + 1 })}
          />
        );
      })}
      <ListAddButtons
        addLabel={t("create.addIngredient")}
        onAdd={() => onAddArrayItem("ingredients")}
        onAddHeading={() => onAddArrayItem("ingredients", { heading: true })}
      />
    </Paper>
  );
}
