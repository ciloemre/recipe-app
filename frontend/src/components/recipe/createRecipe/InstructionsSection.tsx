import { Group, Paper } from "@mantine/core";
import { IconHeading, IconPlus } from "@tabler/icons-react";
import CustomTitle from "../../atoms/CustomTitle";
import { CustomButton } from "../../atoms/CustomButton";
import RecipeInstructionInput from "./RecipeInstructionInput";
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
  return (
    <Paper p="md" mb="md">
      <CustomTitle level={3} mb="sm">
        Hazırlanış Adımları
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
            placeholder={`Adım ${index + 1}`}
          />
        );
      })}
      <Group gap="sm">
        <CustomButton onClick={() => onAddArrayItem("instructions")}>
          <IconPlus size={16} style={{ marginRight: "5px" }} />
          Adım Ekle
        </CustomButton>
        <CustomButton
          variant="light"
          onClick={() => onAddArrayItem("instructions", { heading: true })}
        >
          <IconHeading size={16} style={{ marginRight: "5px" }} />
          Başlık Ekle
        </CustomButton>
      </Group>
    </Paper>
  );
}
