import { Group } from "@mantine/core";
import { CustomTextarea } from "../../atoms/CustomTextarea";
import { CustomInput } from "../../atoms/CustomInput";
import { ListRowActions } from "./ListRowActions";

interface RecipeInstructionInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onInsertHeading: () => void;
  placeholder: string;
  isHeading?: boolean;
}

const headingInputStyles = {
  input: {
    fontWeight: 700,
    backgroundColor: "var(--mantine-color-orange-0)",
    borderColor: "var(--mantine-color-orange-4)",
  },
};

export default function RecipeInstructionInput({
  value,
  onChange,
  onRemove,
  onInsertHeading,
  placeholder,
  isHeading = false,
}: RecipeInstructionInputProps) {
  return (
    <Group mb="xs" mt={isHeading ? "sm" : undefined} wrap="nowrap" align="flex-start" gap="xs">
      {isHeading ? (
        <CustomInput
          style={{ flex: 1, minWidth: 0 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Başlık (ör. Sosun hazırlanışı)"
          styles={headingInputStyles}
        />
      ) : (
        <CustomTextarea
          style={{ flex: 1, minWidth: 0 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      <ListRowActions onInsertHeading={onInsertHeading} onRemove={onRemove} />
    </Group>
  );
}
