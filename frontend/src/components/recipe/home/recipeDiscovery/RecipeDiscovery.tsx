import { Grid, Stack, Title, Text, Button, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import defaultImage from "../../../../assets/h1.png";
import classes from "./RecipeDiscovery.module.css";

export function RecipeDiscovery() {
  return (
    <Box className={classes.container}>
      <div className={classes.gridContainer}>
        <Grid gutter="xl" align="center">
          <Grid.Col span={{ base: 12, sm: 12, lg: 7 }}>
            <Stack gap="md" justify="flex-start" style={{ height: "100%" }}>
              <Title className={classes.title}>
                Lezzetli Tariflerimizi Keşfedin
              </Title>
              <Text size="lg" className={classes.mainText}>
                Mutfağınıza yeni lezzetler katmak için birbirinden özel
                tariflerimizi deneyin. Uzman şeflerimizin rehberliğinde, en
                sevdiğiniz yemekleri kolayca hazırlayabilirsiniz.
              </Text>
              <Text size="md" className={classes.subText}>
                Her seviyeden aşçı için uygun, adım adım anlatımlı
                tariflerimizle mutfakta kendinize güveninizi artırın.
              </Text>
              <Button
                component={Link}
                to="/recipes"
                size="lg"
                variant="filled"
                className={classes.button}
              >
                Tarifleri İncele
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
                alt="Lezzetli Yemek ve Malzemeler"
                className={classes.image}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </div>
    </Box>
  );
}
