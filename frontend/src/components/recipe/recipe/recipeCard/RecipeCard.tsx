import { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  ActionIcon,
  Divider,
  Box,
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconStar,
  IconCalendar,
} from "@tabler/icons-react";
import { Recipe } from "../../../../types/types";
import styles from "./RecipeCard.module.css";
import { useSocket } from "../../../../hooks/useSocket";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
}

function getRatingColor(rating: number) {
  if (rating >= 4) return "green";
  if (rating >= 2) return "yellow";
  return "red";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RecipeCard({
  recipe: initialRecipe,
  isFavorite,
  onFavoriteToggle,
}: RecipeCardProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const { on, off } = useSocket();

  useEffect(() => {
    const handleRatingUpdate = (data: {
      recipeId: string;
      averageRating: number;
      ratingCount: number;
    }) => {
      if (data.recipeId === recipe._id) {
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          averageRating: data.averageRating,
          ratings: Array(data.ratingCount),
        }));
      }
    };

    const handleCommentUpdate = (data: {
      recipeId: string;
      commentCount: number;
    }) => {
      if (data.recipeId === recipe._id) {
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          comments: Array(data.commentCount),
        }));
      }
    };

    on("recipeRated", handleRatingUpdate);
    on("commentAdded", handleCommentUpdate);
    on("commentDeleted", handleCommentUpdate);

    return () => {
      off("recipeRated", handleRatingUpdate);
      off("commentAdded", handleCommentUpdate);
      off("commentDeleted", handleCommentUpdate);
    };
  }, [recipe._id, on, off]);

  useEffect(() => {
    setRecipe(initialRecipe);
  }, [initialRecipe]);

  const authorName =
    typeof recipe.author === "object" && recipe.author !== null
      ? recipe.author.username
      : typeof recipe.author === "string"
      ? recipe.author
      : "Bilinmeyen Yazar";

  return (
    <Box className={styles.cardContainer}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        role="article"
        aria-labelledby={`recipe-title-${recipe._id}`}
        className={styles.card}
      >
        <Card.Section>
          <Image
            src={recipe.image}
            alt={recipe.title}
            className={styles.cardImage}
          />
          <Badge
            className={styles.dateBadge}
            leftSection={<IconCalendar size={14} />}
          >
            {formatDate(recipe.createdAt)}
          </Badge>
          <Badge
            color={getRatingColor(recipe.averageRating)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1,
            }}
          >
            {recipe.averageRating.toFixed(1)}
          </Badge>
        </Card.Section>
        <Group p="apart" mt="md" mb="xs">
          <Text
            lineClamp={1}
            className={styles.cardTitle}
            id={`recipe-title-${recipe._id}`}
          >
            {recipe.title}
          </Text>
        </Group>
        <Text
          lineClamp={1}
          size="sm"
          color="dimmed"
          className={styles.cardDescription}
        >
          {recipe.description}
        </Text>
        <Divider my="sm" />
        <Text lineClamp={1} size="sm" className={styles.cardAuthor}>
          <b>Şef:</b> {authorName}
        </Text>
        <div className={styles.cardFooter}>
          <div className={styles.cardStats}>
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => onFavoriteToggle(recipe._id)}
            >
              {isFavorite ? (
                <IconHeartFilled size={18} />
              ) : (
                <IconHeart size={18} />
              )}
            </ActionIcon>
            <Group gap={5}>
              <IconStar size={18} />
              <Text size="sm">{recipe.ratings?.length || 0}</Text>
            </Group>
            <Group gap={5}>
              <IconMessageCircle size={18} />
              <Text size="sm">{recipe.comments.length}</Text>
            </Group>
          </div>
          <Button
            component={Link}
            to={`/recipe/${recipe._id}`}
            aria-label={`Tarifi gör: ${recipe.title}`}
            className={styles.viewButton}
          >
            Tarifi Gör
          </Button>
        </div>
      </Card>
    </Box>
  );
}
