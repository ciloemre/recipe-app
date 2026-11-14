import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Stack,
  Overlay,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <Box className={styles.heroBox}>
      <Overlay
        gradient={`linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 40%)`}
        opacity={1}
        zIndex={0}
      />
      <Container size="xl" className={styles.container}>
        <Stack justify="center" align="center" className={styles.stack}>
          <Title order={1} className={styles.title}>
            {t("hero.title")}
          </Title>
          <Text c={"white"} size="lg" className={styles.text}>
            {t("hero.subtitle")}
          </Text>
          <Button
            component={Link}
            to="/recipes"
            size="lg"
            className={styles.button}
          >
            {t("hero.cta")}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
