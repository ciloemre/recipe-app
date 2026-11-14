import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("auth.invalidEmail"),
      password: (value) =>
        value.length < 6 ? t("auth.passwordMin") : null,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await onSubmit(values.email, values.password);
    } catch (error) {
      console.error("Giriş hatası:", error);
      form.setErrors({
        email: t("auth.loginFailed"),
        password: t("auth.loginFailed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mx="auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.onSubmit(handleSubmit)(e);
        }}
      >
        <TextInput
          required
          label={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          required
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          mt="md"
          {...form.getInputProps("password")}
        />
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          {t("nav.login")}
        </Button>
      </form>
    </Box>
  );
};
