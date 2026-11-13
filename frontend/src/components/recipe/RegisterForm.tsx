import React, { useMemo, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_RULES,
  confirmDifference,
  getPasswordChecks,
  isPasswordValid,
} from "../../utils/passwordValidation";

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
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "İsim en az 2 karakter olmalıdır" : null,
      username: (value) => {
        if (value.length < 3) return "Kullanıcı adı en az 3 karakter olmalıdır";
        if (!USERNAME_REGEX.test(value))
          return "Yalnızca harf, rakam ve alt çizgi kullanılabilir";
        return null;
      },
      email: (value) => (EMAIL_REGEX.test(value) ? null : "Geçersiz email"),
      password: (value) => {
        const checks = getPasswordChecks(value, value);
        if (!checks.minLength) return "Şifre en az 8 karakter olmalıdır";
        if (!checks.uppercase) return "En az bir büyük harf gerekli";
        if (!checks.lowercase) return "En az bir küçük harf gerekli";
        if (!checks.number) return "En az bir rakam gerekli";
        if (!checks.special) return "En az bir işaret gerekli (-, ! …)";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Şifreler eşit değil" : null,
    },
  });

  const checks = useMemo(
    () => getPasswordChecks(form.values.password, form.values.confirmPassword),
    [form.values.password, form.values.confirmPassword]
  );

  const rulesMet =
    checks.minLength &&
    checks.uppercase &&
    checks.lowercase &&
    checks.number &&
    checks.special;

  const missing = PASSWORD_RULES.filter((rule) => !checks[rule.key]).map(
    (rule) => rule.label
  );
  const met = PASSWORD_RULES.filter((rule) => checks[rule.key]).map(
    (rule) => rule.label
  );

  const showRules = form.values.password.length > 0 || !!form.errors.password;
  const difference = confirmDifference(
    form.values.password,
    form.values.confirmPassword
  );

  const handleSubmit = form.onSubmit(async (values) => {
    if (!isPasswordValid(checks)) return;
    setIsLoading(true);
    try {
      const { confirmPassword: _confirm, ...payload } = values;
      await onSubmit(payload);
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
          label="Ad Soyad"
          placeholder="Adınız Soyadınız"
          {...form.getInputProps("name")}
        />
        <TextInput
          required
          label="Kullanıcı Adı"
          placeholder="kullanici_adi"
          mt="sm"
          {...form.getInputProps("username")}
        />
        <TextInput
          required
          label="Email"
          placeholder="ornek@email.com"
          mt="sm"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          required
          label="Şifre"
          placeholder="Şifreniz"
          mt="sm"
          {...form.getInputProps("password")}
          error={
            form.values.password.length > 0
              ? !rulesMet
              : !!form.errors.password
          }
        />
        {showRules && (
          <Text size="xs" mt={4} lh={1.35}>
            {missing.length > 0 && (
              <Text span c="red" size="xs">
                Eksik: {missing.join(", ")}
              </Text>
            )}
            {missing.length > 0 && met.length > 0 && (
              <Text span c="dimmed" size="xs">
                {" "}
                ·{" "}
              </Text>
            )}
            {met.length > 0 && (
              <Text span c="teal" size="xs">
                Tamam: {met.join(", ")}
              </Text>
            )}
          </Text>
        )}
        <PasswordInput
          required
          label="Şifre Tekrar"
          placeholder="Şifrenizi tekrar girin"
          mt="sm"
          {...form.getInputProps("confirmPassword")}
          error={
            form.values.confirmPassword.length > 0
              ? !checks.match
              : !!form.errors.confirmPassword
          }
        />
        {difference && (
          <Text size="xs" mt={4} c={difference.ok ? "teal" : "red"}>
            {difference.text}
          </Text>
        )}
        <Button type="submit" fullWidth mt="lg" loading={isLoading}>
          Kayıt Ol
        </Button>

        <Text mt="md" size="sm">
          Zaten hesabınız var mı?{" "}
          <Anchor<"button">
            component="button"
            type="button"
            onClick={onLoginClick}
          >
            Giriş yap
          </Anchor>
        </Text>
      </form>
    </Box>
  );
};
