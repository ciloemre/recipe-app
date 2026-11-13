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
import { LoginForm } from "../components/recipe/LoginForm";
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
        title: "Başarılı",
        message: "Giriş yapıldı",
        color: "green",
      });
      navigate("/", { replace: true });
    } catch (error) {
      sessionStorage.removeItem(LOGIN_WELCOME_PENDING_KEY);
      console.error("Giriş hatası:", error);
      let errorMessage = "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      notifications.show({
        title: "Hata",
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
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      <Container size={1100} style={{ height: "100%" }}>
        <Paper
          radius={0}
          p="30px"
          style={{
            borderRight: `1px solid ${theme.colors.gray[3]}`,
            height: "100%",
            maxWidth: "450px",
            overflowY: "auto",
          }}
        >
          <Center>
            <IconChefHat
              style={{
                width: "120px",
                height: "120px",
                marginBottom: theme.spacing.lg,
                color: theme.black,
              }}
              stroke={1.5}
            />
          </Center>

          <Title
            order={2}
            ta="center"
            mt="md"
            mb={50}
            style={{
              color: theme.black,
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            }}
          >
            Lezzetli Tarifler Dünyasına Hoş Geldiniz!
          </Title>

          <LoginForm onSubmit={handleSubmit} />

          <Group justify="space-between" mt="xl">
            <Anchor href="#" onClick={handleRegisterClick} size="xs">
              Hesabınız yok mu? Kayıt olun
            </Anchor>
            <Anchor
              href="#"
              onClick={(event) => event.preventDefault()}
              size="xs"
            >
              Şifrenizi mi unuttunuz?
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
            Giriş yapmadan tariflere göz at
          </Anchor>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
