import React, { useEffect } from "react";
import {
  Paper,
  Title,
  Container,
  Anchor,
  Center,
  Group,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { LoginForm } from "../components/recipe/LoginForm";
import { LanguageSwitcher } from "../components/header/LanguageSwitcher";
import { IconChefHat } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { REDIRECT_KEY } from "../hooks/useRequireAuth";
import {
  LOGIN_WELCOME_PENDING_KEY,
  WELCOME_NAME_KEY,
} from "../utils/welcome";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { login, user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (
      sessionStorage.getItem(WELCOME_NAME_KEY) ||
      sessionStorage.getItem(LOGIN_WELCOME_PENDING_KEY)
    ) {
      return;
    }
    const saved = sessionStorage.getItem(REDIRECT_KEY);
    if (saved) sessionStorage.removeItem(REDIRECT_KEY);
    navigate(saved || "/home", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    sessionStorage.setItem(LOGIN_WELCOME_PENDING_KEY, "1");
    try {
      const loggedIn = await login(email, password);
      sessionStorage.setItem(WELCOME_NAME_KEY, loggedIn.name);
      sessionStorage.removeItem(LOGIN_WELCOME_PENDING_KEY);
      notifications.show({
        title: t("common.success"),
        message: t("auth.loginSuccess"),
        color: "green",
      });
      navigate("/", { replace: true });
    } catch (error) {
      sessionStorage.removeItem(LOGIN_WELCOME_PENDING_KEY);
      console.error("Giriş hatası:", error);
      let errorMessage = t("auth.loginError");
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      notifications.show({
        title: t("common.error"),
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleRegisterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/register");
  };

  if (user) {
    return null;
  }

  return (
    <Box
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
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
                width: "clamp(72px, 22vw, 120px)",
                height: "clamp(72px, 22vw, 120px)",
                marginBottom: theme.spacing.md,
                color: theme.black,
              }}
              stroke={1.5}
            />
          </Center>

          <Title
            order={2}
            ta="center"
            mt="sm"
            mb={{ base: "lg", sm: 40 }}
            fz={{ base: 22, sm: 28 }}
            lh={1.25}
            px="xs"
            style={{
              color: theme.black,
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              textWrap: "balance",
            }}
          >
            {t("auth.welcomeLogin")}
          </Title>

          <LoginForm onSubmit={handleSubmit} />

          <Group justify="space-between" mt="xl" gap="sm" wrap="wrap">
            <Anchor href="#" onClick={handleRegisterClick} size="xs">
              {t("auth.noAccount")} {t("nav.register")}
            </Anchor>
            <Anchor
              href="#"
              onClick={(event) => event.preventDefault()}
              size="xs"
            >
              {t("auth.forgotPassword")}
            </Anchor>
          </Group>
          <Anchor
            component="button"
            type="button"
            size="sm"
            mt="lg"
            onClick={() => navigate("/recipes")}
            style={{ display: "block", width: "100%", textAlign: "center" }}
          >
            {t("auth.browseWithoutLogin")}
          </Anchor>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
