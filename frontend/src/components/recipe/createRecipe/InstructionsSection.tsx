import { Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CustomTitle from "../../atoms/CustomTitle";
import { CustomButton } from "../../atoms/CustomButton";
import RecipeInstructionInput from "./RecipeInstructionInput";

interface InstructionsSectionProps {
  instructions: string[];
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
      {instructions.map((instruction: string, index: number) => (
        <RecipeInstructionInput
          key={index}
          value={instruction}
          onChange={(value) => onArrayInputChange(index, value, "instructions")}
          onRemove={() => onRemoveArrayItem(index, "instructions")}
          placeholder={`Adım ${index + 1}`}
        />
      ))}
      <CustomButton onClick={() => onAddArrayItem("instructions")}>
        <IconPlus size={16} style={{ marginRight: "5px" }} />
        Adım Ekle
      </CustomButton>
    </Paper>
  );
}
