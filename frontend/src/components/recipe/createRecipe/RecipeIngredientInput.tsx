import { Group } from "@mantine/core";
import { CustomInput } from "../../atoms/CustomInput";
import { ListRowActions } from "./ListRowActions";

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
    <Group mb="xs" mt={isHeading ? "sm" : undefined} wrap="nowrap" align="center" gap="xs">
      <CustomInput
        style={{ flex: 1, minWidth: 0 }}
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
      <ListRowActions onInsertHeading={onInsertHeading} onRemove={onRemove} />
    </Group>
  );
}
