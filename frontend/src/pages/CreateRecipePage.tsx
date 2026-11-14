import { Container } from "@mantine/core";
import { RecipeForm } from "../components/recipe/createRecipe/RecipeForm";
import { AuthenticatedContent } from "../components/recipe/AuthenticatedContent";
import { useRecipeFormSubmit } from "../hooks/useRecipeFormSubmit";
import { RecipeFormData } from "../types/types";
import {
  AddListItemOptions,
  RecipeListField,
} from "../utils/sectionHeading";
import PageHeader from "../components/recipe/createRecipe/PageHeader";

export function CreateRecipePage() {
  const {
    formData,
    handleChange,
    handleArrayChange,
    handleArrayAction,
    handleSubmit,
    isLoading,
  } = useRecipeFormSubmit();

  return (
    <AuthenticatedContent>
      <Container p="xl" size="xl">
        <PageHeader title="Yeni Tarif Oluştur" backLink="/recipes" />
        <RecipeForm
          formData={formData}
          onInputChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) =>
            handleChange(e.target.name as keyof RecipeFormData, e.target.value)
          }
          onNumberInputChange={(name: keyof RecipeFormData) =>
            (value: number) =>
              handleChange(name, value)}
          onServingsChange={(value: string) => handleChange("servings", value)}
          onArrayInputChange={handleArrayChange}
          onAddArrayItem={(
            field: RecipeListField,
            options?: AddListItemOptions
          ) =>
            handleArrayAction("add", field, options?.index, options?.heading)
          }
          onRemoveArrayItem={(index: number, field: RecipeListField) =>
            handleArrayAction("remove", field, index)
          }
          onSubmit={handleSubmit}
          onImageUpload={(file: File | null) =>
            handleChange("image", file ? file.name : "")
          }
          onCategoryChange={(value: string) => handleChange("category", value)}
          isLoading={isLoading}
        />
      </Container>
    </AuthenticatedContent>
  );
}

export default CreateRecipePage;
