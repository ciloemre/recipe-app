import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CustomInput } from "../../atoms/CustomInput";
import { CustomTextarea } from "../../atoms/CustomTextarea";
import { FileButton, Button, Image, Select, Text, Box, Group } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { RecipeFormData } from "../../../types/types";
import { resizeImage } from "../../../utils/imageUtils";

interface BasicInfoSectionProps {
  formData: RecipeFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageUpload: (file: File | null) => void;
  onCategoryChange: (value: string) => void;
}

interface Category {
  value: string;
  label: string;
}

const categories: Category[] = [
  { value: "Ana Yemek", label: "Ana Yemek" },
  { value: "Ara Sıcak", label: "Ara Sıcak" },
  { value: "Çorba", label: "Çorba" },
  { value: "Tatlı", label: "Tatlı" },
  { value: "Salata", label: "Salata" },
  { value: "Kahvaltılık", label: "Kahvaltılık" },
  { value: "Atıştırmalık", label: "Atıştırmalık" },
  { value: "İçecek", label: "İçecek" },
  { value: "Vegan", label: "Vegan" },
  { value: "Vejetaryen", label: "Vejetaryen" },
  { value: "Glutensiz", label: "Glutensiz" },
];

const MAX_TITLE_LENGTH = 50;

export function BasicInfoSection({
  formData,
  onInputChange,
  onImageUpload,
  onCategoryChange,
}: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(formData.title);
  const [titleLength, setTitleLength] = useState(formData.title.length);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setTitle(formData.title);
    setTitleLength(formData.title.length);
  }, [formData.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(newValue);
    setTitleLength(newValue.length);
    onInputChange({
      ...e,
      target: { ...e.target, name: "title", value: newValue },
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const resizedImage = await resizeImage(file);
      onImageUpload(file);
      onInputChange({
        target: { name: "image", value: resizedImage },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      setFileName(null);
      onInputChange({
        target: { name: "image", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <Box mb="md">
        <CustomInput
          label={t("create.recipeTitle")}
          name="title"
          value={title}
          onChange={handleTitleChange}
          required
          maxLength={MAX_TITLE_LENGTH}
        />
        <Text
          size="sm"
          color={titleLength === MAX_TITLE_LENGTH ? "red" : "dimmed"}
          mt={5}
        >
          {t("create.chars", { count: titleLength, max: MAX_TITLE_LENGTH })}
        </Text>
      </Box>
      <CustomTextarea
        label={t("create.description")}
        name="description"
        value={formData.description}
        onChange={onInputChange}
        required
        mb="md"
      />
      <Select
        label={t("create.category")}
        placeholder={t("create.categoryPlaceholder")}
        data={categories}
        value={formData.category}
        onChange={(value) => onCategoryChange(value || "")}
        required
        mb="md"
      />
      <Box mb="md">
        <Text size="sm" fw={500} mb={6}>
          {t("create.uploadImage")}
        </Text>
        <Group gap="sm" align="center">
          <FileButton
            onChange={handleImageUpload}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          >
            {(props) => (
              <Button
                {...props}
                type="button"
                variant="light"
                color="orange"
                leftSection={<IconUpload size={16} />}
              >
                {t("create.chooseFile")}
              </Button>
            )}
          </FileButton>
          <Text size="sm" c="dimmed">
            {fileName ?? t("create.fileHint")}
          </Text>
        </Group>
        <Text size="xs" c="dimmed" mt={6}>
          {t("create.fileHelp")}
        </Text>
        {formData.image ? (
          <Image
            src={formData.image}
            alt="Seçilen tarif görseli"
            h={140}
            w={220}
            radius="md"
            mt="sm"
            fit="cover"
          />
        ) : null}
      </Box>
    </>
  );
}
