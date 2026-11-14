import { Group } from "@mantine/core";
import { IconHeading, IconTrash } from "@tabler/icons-react";
import { CustomTextarea } from "../../atoms/CustomTextarea";
import { CustomInput } from "../../atoms/CustomInput";
import { CustomButton } from "../../atoms/CustomButton";

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
    <Group mb="xs" mt={isHeading ? "sm" : undefined} wrap="nowrap" align="flex-start">
      {isHeading ? (
        <CustomInput
          style={{ flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Başlık (ör. Sosun hazırlanışı)"
          styles={headingInputStyles}
        />
      ) : (
        <CustomTextarea
          style={{ flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      <CustomButton
        variant="light"
        icon={<IconHeading size={16} />}
        onClick={onInsertHeading}
        title="Bu satırın altına başlık ekle"
      >
        Başlık
      </CustomButton>
      <CustomButton onClick={onRemove} color="red" title="Sil">
        <IconTrash size={16} />
      </CustomButton>
    </Group>
  );
}
