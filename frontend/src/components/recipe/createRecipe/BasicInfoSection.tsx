import React, { useState, useEffect } from "react";
import { CustomInput } from "../../atoms/CustomInput";
import { CustomTextarea } from "../../atoms/CustomTextarea";
import { FileInput, Select, Text, Box } from "@mantine/core";
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
  const [title, setTitle] = useState(formData.title);
  const [titleLength, setTitleLength] = useState(formData.title.length);

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
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        onImageUpload(file);
        onInputChange({
          target: { name: "image", value: resizedImage },
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        onInputChange({
          target: { name: "image", value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <>
      <Box mb="md">
        <CustomInput
          label="Tarif Başlığı"
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
          {titleLength}/{MAX_TITLE_LENGTH} karakter
        </Text>
      </Box>
      <CustomTextarea
        label="Tarif Açıklaması"
        name="description"
        value={formData.description}
        onChange={onInputChange}
        required
        mb="md"
      />
      <Select
        label="Kategori"
        placeholder="Bir kategori seçin"
        data={categories}
        value={formData.category}
        onChange={(value) => onCategoryChange(value || "")}
        required
        mb="md"
      />
      <FileInput
        label="Resim Yükle"
        accept="image/*"
        onChange={handleImageUpload}
        mb="md"
      />
    </>
  );
}
