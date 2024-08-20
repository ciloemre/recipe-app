import { Group } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CustomTextarea } from "../../atoms/CustomTextarea";
import { CustomButton } from "../../atoms/CustomButton";

interface RecipeInstructionInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder: string;
}

export default function RecipeInstructionInput({
  value,
  onChange,
  onRemove,
  placeholder,
}: RecipeInstructionInputProps) {
  return (
    <Group mb="xs">
      <CustomTextarea
        style={{ flex: 1 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <CustomButton onClick={onRemove} color="red">
        <IconTrash size={16} />
      </CustomButton>
    </Group>
  );
}
