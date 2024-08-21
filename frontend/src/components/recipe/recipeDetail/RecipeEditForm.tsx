import React, { useState } from "react";
import { Paper, Title, Container } from "@mantine/core";
import { Recipe, RecipeFormData } from "../../../types/types";
import { BasicInfoSection } from "../createRecipe/BasicInfoSection";
import { IngredientsSection } from "../createRecipe/IngredientsSection";
import { InstructionsSection } from "../createRecipe/InstructionsSection";
import { CookingInfoSection } from "../createRecipe/CookingInfoSection";
import { CustomButton } from "../../atoms/CustomButton";
import { resizeImage } from "../../../utils/imageUtils";
import { openCancelConfirmModal } from "../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { validateRecipeForm } from "../../../utils/validateRecipeForm";

interface RecipeEditFormProps {
  recipe: Recipe;
  onSubmit: (updatedRecipe: Partial<Recipe>) => void;
  onCancel: () => void;
}

export const RecipeEditForm: React.FC<RecipeEditFormProps> = ({
  recipe,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: recipe.title,
    description: recipe.description,
    image: recipe.image,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    category: recipe.category,
  });

  const handleChange = (name: keyof RecipeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: "ingredients" | "instructions"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleArrayAction = (
    action: "add" | "remove",
    field: "ingredients" | "instructions",
    index?: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        action === "add"
          ? [...prev[field], ""]
          : prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRecipeForm(formData)) return;
    onSubmit(formData);
    notifications.show({
      title: "Başarılı",
      message: "Tarif başarıyla güncellendi.",
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        handleChange("image", resizedImage);
        notifications.show({
          title: "Başarılı",
          message: "Resim başarıyla yüklendi ve boyutlandırıldı.",
          color: "green",
          icon: <IconCheck size="1.1rem" />,
        });
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        notifications.show({
          title: "Hata",
          message: "Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
          color: "red",
          icon: <IconX size="1.1rem" />,
        });
      }
    }
  };

  const handleCancelClick = () => {
    openCancelConfirmModal("Düzenleme", onCancel);
  };

  return (
    <Container size="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} mb="xl">
          Tarifi Düzenle
        </Title>
        <form onSubmit={handleSubmit}>
          <BasicInfoSection
            formData={formData}
            onInputChange={(e) =>
              handleChange(
                e.target.name as keyof RecipeFormData,
                e.target.value
              )
            }
            onImageUpload={handleImageUpload}
            onCategoryChange={(value) => handleChange("category", value)}
          />
          <IngredientsSection
            ingredients={formData.ingredients}
            onArrayInputChange={handleArrayChange}
            onAddArrayItem={() => handleArrayAction("add", "ingredients")}
            onRemoveArrayItem={(index) =>
              handleArrayAction("remove", "ingredients", index)
            }
          />
          <InstructionsSection
            instructions={formData.instructions}
            onArrayInputChange={handleArrayChange}
            onAddArrayItem={() => handleArrayAction("add", "instructions")}
            onRemoveArrayItem={(index) =>
              handleArrayAction("remove", "instructions", index)
            }
          />
          <CookingInfoSection
            formData={formData}
            onNumberInputChange={(name) => (value: number) =>
              handleChange(name, value)}
          />
          <CustomButton type="submit" fullWidth mt="xl">
            Değişiklikleri Kaydet
          </CustomButton>
          <CustomButton
            variant="outline"
            fullWidth
            mt="md"
            onClick={handleCancelClick}
          >
            İptal
          </CustomButton>
        </form>
      </Paper>
    </Container>
  );
};
