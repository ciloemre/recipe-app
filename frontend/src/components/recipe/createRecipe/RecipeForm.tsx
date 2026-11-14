import React from "react";
import { Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { RecipeFormData } from "../../../types/types";
import { BasicInfoSection } from "./BasicInfoSection";
import { IngredientsSection } from "./IngredientsSection";
import { InstructionsSection } from "./InstructionsSection";
import { CookingInfoSection } from "./CookingInfoSection";
import { CustomButton } from "../../atoms/CustomButton";
import {
  AddListItemOptions,
  RecipeListField,
} from "../../../utils/sectionHeading";

interface RecipeFormProps {
  formData: RecipeFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onNumberInputChange: (name: keyof RecipeFormData) => (value: number) => void;
  onServingsChange: (value: string) => void;
  onArrayInputChange: (
    index: number,
    value: string,
    field: RecipeListField
  ) => void;
  onAddArrayItem: (field: RecipeListField, options?: AddListItemOptions) => void;
  onRemoveArrayItem: (index: number, field: RecipeListField) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (file: File | null) => void;
  onCategoryChange: (value: string) => void;
  isLoading?: boolean;
}

export function RecipeForm({
  formData,
  onInputChange,
  onNumberInputChange,
  onServingsChange,
  onArrayInputChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onSubmit,
  onImageUpload,
  onCategoryChange,
  isLoading,
}: RecipeFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Box px={{ base: "sm", sm: "md" }}>
        <BasicInfoSection
          formData={formData}
          onInputChange={onInputChange}
          onImageUpload={onImageUpload}
          onCategoryChange={onCategoryChange}
        />
      </Box>
      <IngredientsSection
        ingredients={formData.ingredients}
        onArrayInputChange={onArrayInputChange}
        onAddArrayItem={onAddArrayItem}
        onRemoveArrayItem={onRemoveArrayItem}
      />
      <InstructionsSection
        instructions={formData.instructions}
        onArrayInputChange={onArrayInputChange}
        onAddArrayItem={onAddArrayItem}
        onRemoveArrayItem={onRemoveArrayItem}
      />
      <Box px={{ base: "sm", sm: "md" }}>
        <CookingInfoSection
          formData={formData}
          onNumberInputChange={onNumberInputChange}
          onServingsChange={onServingsChange}
        />
        <CustomButton
          mb={"20px"}
          type="submit"
          fullWidth
          mt="xl"
          loading={isLoading}
        >
          {t("create.saveRecipe")}
        </CustomButton>
      </Box>
    </form>
  );
}
