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
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconClock, IconChefHat, IconCooker } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getLatestRecipes } from "../../../../utils/recipeUtils";
import { ExtendedRecipe } from "../../../../types/types";
import styles from "./LatestRecipes.module.css";

export function LatestRecipes() {
  const [latestRecipes, setLatestRecipes] = useState<ExtendedRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        const recipes = await getLatestRecipes(3);
        const extendedRecipes: ExtendedRecipe[] = recipes.map((recipe) => ({
          ...recipe,
          author:
            typeof recipe.author === "string"
              ? { _id: "", username: recipe.author, avatar: undefined }
              : { ...recipe.author, avatar: undefined },
          difficulty: "Normal",
        }));
        setLatestRecipes(extendedRecipes);
      } catch (error) {
        console.error("Son tarifleri çekerken hata oluştu:", error);
        setError(
          "Tarifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    };
    fetchLatestRecipes();
  }, []);

  return (
    <Container className={styles.container} size={"xl"}>
      <Title className={styles.title}>Son Eklenen Tarifler</Title>

      {error ? (
        <Text className={styles.errorText}>{error}</Text>
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
                />
                <Badge color="orange" className={styles.newBadge}>
                  Yeni
                </Badge>
              </Card.Section>

              <Group className={styles.authorInfo}>
                <Avatar src={recipe.author.avatar} radius="xl" />
                <Text size="sm">{recipe.author.username}</Text>
              </Group>
              <Group p="apart" mt="md" mb="xs">
                <Text className={styles.recipeTitle}>{recipe.title}</Text>
              </Group>
              <Text
                size="sm"
                color="dimmed"
                className={styles.recipeDescription}
                mb="md"
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
