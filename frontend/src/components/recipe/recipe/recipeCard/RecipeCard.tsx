import { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Avatar,
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
import { useTranslation } from "react-i18next";
import { Recipe } from "../../../../types/types";
import styles from "./RecipeCard.module.css";
import { useSocket } from "../../../../hooks/useSocket";
import { displayPersonName } from "../../../../utils/displayName";
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatLocaleRating,
} from "../../../../utils/localeFormat";

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

export function RecipeCard({
  recipe: initialRecipe,
  isFavorite,
  onFavoriteToggle,
}: RecipeCardProps) {
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(initialRecipe);
  const { on, off } = useSocket();
  const lang = i18n.language?.slice(0, 2) || "tr";

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

  const authorName = displayPersonName(
    recipe.author,
    t("recipes.unknownChef")
  );

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
        <Card.Section className={styles.imageSection}>
          <Image
            src={recipe.image}
            alt={recipe.title}
            className={styles.cardImage}
            loading="lazy"
          />
          <Badge
            className={styles.dateBadge}
            leftSection={<IconCalendar size={14} />}
          >
            {formatLocaleDate(recipe.createdAt, lang)}
          </Badge>
          <Badge
            color={getRatingColor(recipe.averageRating)}
            className={styles.ratingBadge}
          >
            {formatLocaleRating(recipe.averageRating, lang)}
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
        <Group gap={8} wrap="nowrap" className={styles.authorRow}>
          <Avatar
            src={
              typeof recipe.author === "object"
                ? recipe.author.avatar || null
                : null
            }
            size={28}
            radius="xl"
            color="orange"
          >
            {authorName.slice(0, 1).toUpperCase()}
          </Avatar>
          <Text lineClamp={1} size="sm" className={styles.cardAuthor}>
            <b>{t("recipes.chefPrefix")}</b> {authorName}
          </Text>
        </Group>
        <div className={styles.cardFooter}>
          <div className={styles.cardStats}>
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => onFavoriteToggle(recipe._id)}
              aria-label={
                isFavorite
                  ? t("recipes.removeFavorite")
                  : t("recipes.addFavorite")
              }
            >
              {isFavorite ? (
                <IconHeartFilled size={18} />
              ) : (
                <IconHeart size={18} />
              )}
            </ActionIcon>
            <Group gap={5} wrap="nowrap">
              <IconStar size={18} />
              <Text size="sm">
                {formatLocaleNumber(
                  recipe.ratings?.length || recipe.ratingCount || 0,
                  lang
                )}
              </Text>
            </Group>
            <Group gap={5} wrap="nowrap">
              <IconMessageCircle size={18} />
              <Text size="sm">
                {formatLocaleNumber(
                  recipe.comments?.length || recipe.commentCount || 0,
                  lang
                )}
              </Text>
            </Group>
          </div>
          <Button
            component={Link}
            to={`/recipe/${recipe._id}`}
            aria-label={t("recipes.viewRecipe", { title: recipe.title })}
            className={styles.viewButton}
          >
            {t("latest.viewRecipe")}
          </Button>
        </div>
      </Card>
    </Box>
  );
}
