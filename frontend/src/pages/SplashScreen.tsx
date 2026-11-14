import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Text } from "@mantine/core";
import styles from "./SplashScreen.module.css";
import {
  REDIRECT_AFTER_LOGIN_KEY,
  WELCOME_NAME_KEY,
} from "../utils/welcome";

export function SplashScreen() {
  const navigate = useNavigate();
  const [userName] = useState(() => sessionStorage.getItem(WELCOME_NAME_KEY));

  useEffect(() => {
    if (!userName) return;
    sessionStorage.removeItem(WELCOME_NAME_KEY);
    const timer = setTimeout(() => {
      const saved = sessionStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);
      if (saved) sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
      navigate(saved || "/home", { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, userName]);

  if (!userName) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Box className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.content}>
        <Text className={styles.welcomeText}>Hoş Geldiniz</Text>
        <Text className={styles.userName}>{userName}</Text>
        <Text className={styles.subText}>
          Lezzetli tarifler sizi bekliyor!
        </Text>
      </div>
    </Box>
  );
}

export default SplashScreen;
