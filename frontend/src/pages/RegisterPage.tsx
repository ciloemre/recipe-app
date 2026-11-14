import React from "react";
import {
  Paper,
  Container,
  Center,
  Box,
  Anchor,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconChefHat } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RegisterForm } from "../components/recipe/RegisterForm";
import { LanguageSwitcher } from "../components/header/LanguageSwitcher";
import CustomTitle from "../components/atoms/CustomTitle";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { register } = useAuth();

  const handleSubmit = async (values: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await register(values);
      notifications.show({
        title: t("common.success"),
        message: t("auth.registerSuccess"),
        color: "green",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      notifications.show({
        title: t("common.error"),
        message:
          error instanceof Error
            ? error.message
            : t("auth.registerError"),
        color: "red",
      });
    }
  };

  const handleLoginClick = () => navigate("/login");

  return (
    <Box
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      <Container size={1100} p={0} style={{ minHeight: "100dvh" }}>
        <Paper
          radius={0}
          p={{ base: "lg", sm: 30 }}
          style={{
            borderRight: `1px solid ${theme.colors.gray[3]}`,
            minHeight: "100dvh",
            width: "100%",
            maxWidth: "450px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <Group justify="flex-end" mb="sm">
            <LanguageSwitcher />
          </Group>
          <Center>
            <IconChefHat
              style={{
                width: "clamp(72px, 22vw, 96px)",
                height: "clamp(72px, 22vw, 96px)",
                marginBottom: theme.spacing.xs,
                color: theme.black,
              }}
              stroke={1.5}
            />
          </Center>

          <CustomTitle
            order={2}
            ta="center"
            mt="xs"
            mb="md"
            fz={{ base: 22, sm: 28 }}
            lh={1.25}
            px="xs"
            style={{
              color: theme.black,
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              textWrap: "balance",
            }}
          >
            {t("auth.welcomeRegister")}
          </CustomTitle>

          <RegisterForm
            onSubmit={handleSubmit}
            onLoginClick={handleLoginClick}
          />
          <Anchor
            component="button"
            type="button"
            size="sm"
            mt="md"
            onClick={() => navigate("/recipes")}
            style={{ display: "block", width: "100%", textAlign: "center" }}
          >
            {t("auth.browseWithoutRegister")}
          </Anchor>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
