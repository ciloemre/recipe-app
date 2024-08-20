import { Group } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CustomButton } from "../../atoms/CustomButton";
import { CustomInput } from "../../atoms/CustomInput";

interface RecipeIngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder: string;
}

export default function RecipeIngredientInput({
  value,
  onChange,
  onRemove,
  placeholder,
}: RecipeIngredientInputProps) {
  return (
    <Group mb="xs">
      <CustomInput
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
