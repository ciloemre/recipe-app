import { Group } from "@mantine/core";
import { CustomInput } from "../../atoms/CustomInput";
import { RecipeFormData } from "../../../types/types";

interface CookingInfoSectionProps {
  formData: RecipeFormData;
  onNumberInputChange: (name: keyof RecipeFormData) => (value: number) => void;
  onServingsChange: (value: string) => void;
}

export function CookingInfoSection({
  formData,
  onNumberInputChange,
  onServingsChange,
}: CookingInfoSectionProps) {
  return (
    <Group grow mb="md">
      <CustomInput
        type="number"
        label="Hazırlık Süresi (dakika)"
        name="prepTime"
        value={formData.prepTime.toString()}
        onChange={(e) =>
          onNumberInputChange("prepTime")(Number(e.target.value))
        }
        min={0}
      />
      <CustomInput
        type="number"
        label="Pişirme Süresi (dakika)"
        name="cookTime"
        value={formData.cookTime.toString()}
        onChange={(e) =>
          onNumberInputChange("cookTime")(Number(e.target.value))
        }
        min={0}
      />
      <CustomInput
        type="text"
        label="Porsiyon"
        name="servings"
        placeholder="ör. 4-6 kişilik, 1 tepsi"
        value={String(formData.servings ?? "")}
        onChange={(e) => onServingsChange(e.target.value)}
      />
    </Group>
  );
}
