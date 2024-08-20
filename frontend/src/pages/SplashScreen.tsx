import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, Container } from "@mantine/core";
import { getUser } from "../api/api";
import styles from "./SplashScreen.module.css";

export function SplashScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setUserName(userData.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("Misafir");
      }
    };

    fetchUserData();

    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className={styles.container}>
      <div className={styles.backgroundImage} />
      <Container className={styles.content}>
        <Text size="50px" mb={"60px"} className={styles.welcomeText}>
          Hoş Geldiniz
        </Text>
        <Text size="100px" mb={"50px"} className={styles.userName}>
          {userName}
        </Text>
        <Text size="30px" className={styles.subText}>
          Lezzetli tarifler sizi bekliyor!
        </Text>
      </Container>
    </Box>
  );
}

export default SplashScreen;
