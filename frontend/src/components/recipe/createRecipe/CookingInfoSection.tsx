import { SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" mb="md">
      <CustomInput
        type="number"
        label={t("create.prepTime")}
        name="prepTime"
        value={formData.prepTime.toString()}
        onChange={(e) =>
          onNumberInputChange("prepTime")(Number(e.target.value))
        }
        min={0}
      />
      <CustomInput
        type="number"
        label={t("create.cookTime")}
        name="cookTime"
        value={formData.cookTime.toString()}
        onChange={(e) =>
          onNumberInputChange("cookTime")(Number(e.target.value))
        }
        min={0}
      />
      <CustomInput
        type="text"
        label={t("create.servings")}
        name="servings"
        value={String(formData.servings ?? "")}
        onChange={(e) => onServingsChange(e.target.value)}
      />
    </SimpleGrid>
  );
}
