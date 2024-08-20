import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { useForm } from "@mantine/form";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Geçersiz email"),
      password: (value) =>
        value.length < 6 ? "Şifre en az 6 karakter olmalıdır" : null,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await onSubmit(values.email, values.password);
    } catch (error) {
      console.error("Giriş hatası:", error);
      form.setErrors({ email: "Giriş başarısız", password: "Giriş başarısız" });
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
          label="Email"
          placeholder="ornek@email.com"
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
          Giriş Yap
        </Button>
      </form>
    </Box>
  );
};
