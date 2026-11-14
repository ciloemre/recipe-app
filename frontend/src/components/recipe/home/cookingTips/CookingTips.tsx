import { Title, Grid, Card, Text, Box, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import defaultImage from "../../../../assets/h2.png";
import styles from "./CookingTips.module.css";

export function CookingTips() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";

  return (
    <Box className={styles.container} key={lang}>
      <Grid gutter="xl" align="stretch">
        <Grid.Col span={{ base: 12, sm: 4, lg: 5 }} className={styles.imageCol}>
          <Box className={styles.imageContainer}>
            <img
              src={defaultImage}
              alt={t("tips.imageAlt")}
              className={styles.image}
            />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 12, lg: 7 }}>
          <Stack
            className={styles.stack}
            gap="md"
            justify="center"
            style={{ height: "100%" }}
          >
            <Title className={styles.title}>{t("tips.title")}</Title>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>{t("tips.sharpKnives")}</Text>
              <Text size="sm" c="dimmed">
                {t("tips.sharpKnivesText")}
              </Text>
            </Card>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>{t("tips.miseEnPlace")}</Text>
              <Text size="sm" c="dimmed">
                {t("tips.miseEnPlaceText")}
              </Text>
            </Card>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>{t("tips.salt")}</Text>
              <Text size="sm" c="dimmed">
                {t("tips.saltText")}
              </Text>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
