import { Grid, Stack, Title, Text, Button, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import defaultImage from "../../../../assets/h1.png";
import classes from "./RecipeDiscovery.module.css";

export function RecipeDiscovery() {
  const { t } = useTranslation();

  return (
    <Box className={classes.container}>
      <div className={classes.gridContainer}>
        <Grid gutter="xl" align="center">
          <Grid.Col span={{ base: 12, sm: 12, lg: 7 }}>
            <Stack gap="md" justify="flex-start" style={{ height: "100%" }}>
              <Title className={classes.title}>{t("discovery.title")}</Title>
              <Text size="lg" className={classes.mainText}>
                {t("discovery.main")}
              </Text>
              <Text size="md" className={classes.subText}>
                {t("discovery.sub")}
              </Text>
              <Button
                component={Link}
                to="/recipes"
                size="lg"
                variant="filled"
                className={classes.button}
              >
                {t("discovery.cta")}
              </Button>
            </Stack>
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, sm: 4, lg: 5 }}
            className={classes.imageColumn}
          >
            <Box className={classes.imageWrapper}>
              <img
                src={defaultImage}
                alt={t("discovery.imageAlt")}
                className={classes.image}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </div>
    </Box>
  );
}
