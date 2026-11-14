import { Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";
import CustomTitle from "../../atoms/CustomTitle";
import RecipeInstructionInput from "./RecipeInstructionInput";
import { ListAddButtons } from "./ListRowActions";
import {
  AddListItemOptions,
  isSectionHeading,
  RecipeListField,
  sectionHeadingText,
  toSectionHeading,
} from "../../../utils/sectionHeading";

interface InstructionsSectionProps {
  instructions: string[];
  onArrayInputChange: (
    index: number,
    value: string,
    field: RecipeListField
  ) => void;
  onAddArrayItem: (field: RecipeListField, options?: AddListItemOptions) => void;
  onRemoveArrayItem: (index: number, field: RecipeListField) => void;
}

export function InstructionsSection({
  instructions,
  onArrayInputChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: InstructionsSectionProps) {
  const { t } = useTranslation();

  return (
    <Paper p={{ base: "sm", sm: "md" }} mb="md">
      <CustomTitle level={3} mb="sm">
        {t("create.instructions")}
      </CustomTitle>
      {instructions.map((instruction: string, index: number) => {
        const heading = isSectionHeading(instruction);
        return (
          <RecipeInstructionInput
            key={index}
            value={heading ? sectionHeadingText(instruction) : instruction}
            isHeading={heading}
            onChange={(value) =>
              onArrayInputChange(
                index,
                heading ? toSectionHeading(value) : value,
                "instructions"
              )
            }
            onInsertHeading={() =>
              onAddArrayItem("instructions", {
                index: index + 1,
                heading: true,
              })
            }
            onRemove={() => onRemoveArrayItem(index, "instructions")}
            placeholder={t("create.stepPlaceholder", { n: index + 1 })}
          />
        );
      })}
      <ListAddButtons
        addLabel={t("create.addStep")}
        onAdd={() => onAddArrayItem("instructions")}
        onAddHeading={() => onAddArrayItem("instructions", { heading: true })}
      />
    </Paper>
  );
}
