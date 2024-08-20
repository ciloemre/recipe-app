import { Title, Grid, Card, Text, Box, Stack } from "@mantine/core";
import defaultImage from "../../../../assets/h2.png";
import styles from "./CookingTips.module.css";

export function CookingTips() {
  return (
    <Box className={styles.container}>
      <Grid gutter="xl" align="stretch">
        <Grid.Col span={{ base: 12, sm: 4, lg: 5 }}>
          <Box className={styles.imageContainer}>
            <img
              src={defaultImage}
              alt="Lezzetli Yemek ve Malzemeler"
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
            <Title className={styles.title}>
              Mutfak İpuçları ve Püf Noktaları
            </Title>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>Keskin Bıçaklar</Text>
              <Text size="sm" color="dimmed">
                Bıçaklarınızı her kullanımdan önce bileyin. Keskin bıçaklar,
                yiyecekleri daha kolay ve güvenli bir şekilde kesmenizi sağlar.
              </Text>
            </Card>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>Mise en Place</Text>
              <Text size="sm" color="dimmed">
                Yemek yapmaya başlamadan önce tüm malzemeleri hazırlayın ve
                ölçün. Bu, pişirme sürecini daha düzenli ve stressiz hale
                getirir.
              </Text>
            </Card>
            <Card shadow="sm" p="lg" radius="md" className={styles.card}>
              <Text className={styles.cardTitle}>Tuz Kullanımı</Text>
              <Text size="sm" color="dimmed">
                Yemeğinizi pişirirken aşama aşama tuz ekleyin. Bu, lezzetin daha
                iyi dağılmasını ve dengelenmesini sağlar.
              </Text>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
