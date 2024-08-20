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
import styles from "./HeroSection.module.css";

export function HeroSection() {
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
            Lezzetli Tarifler Dünyasına Hoş Geldiniz
          </Title>
          <Text c={"white"} size="lg" className={styles.text}>
            Binlerce tarif, sayısız lezzet keşfi... Mutfağınızda yeni maceralar
            sizi bekliyor!
          </Text>
          <Button
            component={Link}
            to="/recipes"
            size="lg"
            className={styles.button}
          >
            Tarifleri Keşfet
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
