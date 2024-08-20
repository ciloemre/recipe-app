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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    try {
      console.log("Login attempt with:", email);
      await login(email, password);
      console.log("Login successful");
      notifications.show({
        title: "Başarılı",
        message: "Giriş yapıldı",
        color: "green",
      });
      navigate("/");
    } catch (error) {
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
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
        position: "absolute",
      }}
    >
      <Container size={1100} pos="relative" style={{ height: "100%" }}>
        <Paper
          radius={0}
          p="30px"
          style={{
            borderRight: `1px solid ${theme.colors.gray[3]}`,
            height: "100%",
            maxWidth: "450px",
          }}
        >
          <Center>
            <IconChefHat
              style={{
                width: "120px",
                height: "120px",
                fontSize: "120px",
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

          <Group p="apart" m="30px" mt="xl">
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
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
