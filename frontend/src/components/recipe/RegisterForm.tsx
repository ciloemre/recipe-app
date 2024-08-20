import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";

interface RegisterFormProps {
  onSubmit: (values: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onLoginClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 3 ? "Kullanıcı adı en az 3 karakter olmalıdır" : null,
      name: (value) =>
        value.length < 2 ? "İsim en az 2 karakter olmalıdır" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Geçersiz email"),
      password: (value) =>
        value.length < 6 ? "Şifre en az 6 karakter olmalıdır" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Kullanıcı Adı"
          placeholder="kullanici_adi"
          {...form.getInputProps("username")}
        />
        <TextInput
          required
          label="İsim"
          placeholder="Adınız Soyadınız"
          mt="md"
          {...form.getInputProps("name")}
        />
        <TextInput
          required
          label="Email"
          placeholder="ornek@email.com"
          mt="md"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          required
          label="Şifre"
          placeholder="Şifreniz"
          mt="md"
          {...form.getInputProps("password")}
        />
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Kayıt Ol
        </Button>

        <Text mt="md">
          Zaten hesabınız var mı?{" "}
          <Anchor<"button"> onClick={onLoginClick} w={700}>
            Giriş yap
          </Anchor>
        </Text>
      </form>
    </Box>
  );
};
