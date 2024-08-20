import React from "react";
import { Paper, Container, Center, Box, useMantineTheme } from "@mantine/core";
import { IconChefHat } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/recipe/RegisterForm";
import CustomTitle from "../components/atoms/CustomTitle";
import { registerUser } from "../api/api";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleSubmit = async (values: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await registerUser(values);
      notifications.show({
        title: "Başarılı",
        message: "Kayıt işlemi tamamlandı",
        color: "green",
      });
      navigate("/login");
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
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
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

          <CustomTitle
            order={2}
            ta="center"
            mt="md"
            mb={50}
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
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
