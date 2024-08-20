import { Container } from "@mantine/core";
import { RecipeForm } from "../components/recipe/createRecipe/RecipeForm";
import CustomTitle from "../components/atoms/CustomTitle";
import { AuthenticatedContent } from "../components/recipe/AuthenticatedContent";
import { useRecipeFormSubmit } from "../hooks/useRecipeFormSubmit";
import { RecipeFormData } from "../types/types";

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
      <Container p="xl" size="md">
        <CustomTitle level={1} mb="xl">
          Yeni Tarif Oluştur
        </CustomTitle>
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
          onArrayInputChange={handleArrayChange}
          onAddArrayItem={(field: "ingredients" | "instructions") =>
            handleArrayAction("add", field)
          }
          onRemoveArrayItem={(
            index: number,
            field: "ingredients" | "instructions"
          ) => handleArrayAction("remove", field, index)}
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
