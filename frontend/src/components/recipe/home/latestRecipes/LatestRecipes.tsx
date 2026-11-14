import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Group,
  Text,
  Badge,
  Button,
  Avatar,
  Loader,
  Center,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconClock, IconChefHat, IconCooker } from "@tabler/icons-react";
import { useMemo } from "react";
import { ExtendedRecipe } from "../../../../types/types";
import styles from "./LatestRecipes.module.css";
import { displayPersonName } from "../../../../utils/displayName";
import { useRecipe } from "../../../../contexts/RecipeContext";

export function LatestRecipes() {
  const { recipes, loading, error: recipeError } = useRecipe();

  const latestRecipes = useMemo<ExtendedRecipe[]>(
    () =>
      recipes.slice(0, 3).map((recipe) => ({
        ...recipe,
        author:
          typeof recipe.author === "string"
            ? { _id: "", username: recipe.author }
            : recipe.author,
        difficulty: "Normal",
      })),
    [recipes]
  );

  const error = recipeError
    ? "Tarifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    : null;

  return (
    <Container className={styles.container} size={"xl"}>
      <Title className={styles.title}>Son Eklenen Tarifler</Title>

      {error ? (
        <Text className={styles.errorText}>{error}</Text>
      ) : loading && latestRecipes.length === 0 ? (
        <Center py="xl">
          <Loader color="orange" />
        </Center>
      ) : latestRecipes.length === 0 ? (
        <Text className={styles.noRecipesText}>Henüz tarif eklenmemiş.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {latestRecipes.map((recipe) => (
            <Card
              key={recipe._id}
              shadow="sm"
              p="lg"
              radius="md"
              className={styles.card}
            >
              <Card.Section className={styles.imageSection}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className={styles.recipeImage}
                  loading="lazy"
                />
                <Badge color="orange" className={styles.newBadge}>
                  Yeni
                </Badge>
              </Card.Section>

              <Group className={styles.authorInfo}>
                <Avatar
                  src={recipe.author.avatar || null}
                  radius="xl"
                  size="sm"
                  color="orange"
                >
                  {displayPersonName(recipe.author, "Bilinmeyen Şef")
                    .slice(0, 1)
                    .toUpperCase()}
                </Avatar>
                <Text size="sm" lineClamp={1}>
                  {displayPersonName(recipe.author, "Bilinmeyen Şef")}
                </Text>
              </Group>
              <Group p="apart" mt="md" mb="xs">
                <Text className={styles.recipeTitle}>{recipe.title}</Text>
              </Group>
              <Text
                size="sm"
                color="dimmed"
                className={styles.recipeDescription}
                mb="md"
                lineClamp={3}
              >
                {recipe.description}
              </Text>
              <Group className={styles.recipeInfo}>
                <Group className={styles.prepTime} style={{ gap: "4px" }}>
                  <IconClock size={16} />
                  <Text className={styles.prepTimeText} size="xs">
                    {recipe.prepTime} dk
                  </Text>
                </Group>
                <Group className={styles.cookTime} style={{ gap: "4px" }}>
                  <IconCooker size={16} />
                  <Text size="xs">{recipe.cookTime} dk</Text>
                </Group>
                <Group className={styles.difficulty} style={{ gap: "4px" }}>
                  <IconChefHat size={16} />
                  <Text size="xs">{recipe.difficulty || "Orta"}</Text>
                </Group>
              </Group>

              <Button
                fullWidth
                mt="md"
                component={Link}
                to={`/recipe/${recipe._id}`}
              >
                Tarifi Gör
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
