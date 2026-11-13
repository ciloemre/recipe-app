import React from "react";
import {
  Paper,
  Container,
  Center,
  Box,
  Anchor,
  useMantineTheme,
} from "@mantine/core";
import { IconChefHat } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/recipe/RegisterForm";
import CustomTitle from "../components/atoms/CustomTitle";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage: React.FC = () => {
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
        title: "Başarılı",
        message: "Kayıt işlemi tamamlandı",
        color: "green",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      notifications.show({
        title: "Hata",
        message:
          error instanceof Error
            ? error.message
            : "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.",
        color: "red",
      });
    }
  };

  const handleLoginClick = () => navigate("/login");

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
          "url(https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
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
                width: "96px",
                height: "96px",
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
            style={{
              color: theme.black,
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            }}
          >
            Lezzetli Tarifler Dünyasına Katılın!
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
            Kayıt olmadan tariflere göz at
          </Anchor>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
