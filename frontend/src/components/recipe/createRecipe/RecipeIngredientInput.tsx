import { Group } from "@mantine/core";
import { IconHeading, IconTrash } from "@tabler/icons-react";
import { CustomButton } from "../../atoms/CustomButton";
import { CustomInput } from "../../atoms/CustomInput";

interface RecipeIngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onInsertHeading: () => void;
  placeholder: string;
  isHeading?: boolean;
}

export default function RecipeIngredientInput({
  value,
  onChange,
  onRemove,
  onInsertHeading,
  placeholder,
  isHeading = false,
}: RecipeIngredientInputProps) {
  return (
    <Group mb="xs" mt={isHeading ? "sm" : undefined} wrap="nowrap" align="center">
      <CustomInput
        style={{ flex: 1 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isHeading ? "Başlık (ör. Sos için)" : placeholder}
        styles={
          isHeading
            ? {
                input: {
                  fontWeight: 700,
                  backgroundColor: "var(--mantine-color-orange-0)",
                  borderColor: "var(--mantine-color-orange-4)",
                },
              }
            : undefined
        }
      />
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
