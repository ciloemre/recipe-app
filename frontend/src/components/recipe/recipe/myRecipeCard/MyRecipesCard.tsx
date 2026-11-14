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
import { Link, useNavigate } from "react-router-dom";
import {
  IconEdit,
  IconTrash,
  IconStar,
  IconMessageCircle,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Recipe } from "../../../../types/types";
import styles from "./MyRecipesCard.module.css";
import { openConfirmModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatLocaleRating,
} from "../../../../utils/localeFormat";

interface MyRecipeCardProps {
  recipe: Recipe;
  onDeleteRecipe: (recipeId: string) => Promise<void>;
  onEditRecipe: (updatedRecipe: Partial<Recipe>) => Promise<void>;
}

function getRatingColor(rating: number) {
  if (rating >= 4) return "green";
  if (rating >= 2) return "yellow";
  return "red";
}

export function MyRecipesCard({
  recipe: initialRecipe,
  onDeleteRecipe,
}: MyRecipeCardProps) {
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(initialRecipe);
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate(`/recipe/${recipe._id}?edit=true`);
  };

  const handleDelete = () => {
    openConfirmModal(
      t("recipes.deleteTitle"),
      t("recipes.deleteMessage"),
      () => {
        onDeleteRecipe(recipe._id)
          .then(() => {
            showDeleteNotification();
          })
          .catch((error) => {
            console.error("Silme işlemi sırasında hata oluştu:", error);
          });
      },
      undefined,
      t("recipes.confirmDelete"),
      t("recipes.cancelDelete")
    );
  };

  const showDeleteNotification = () => {
    notifications.show({
      title: t("recipes.deletedTitle"),
      message: t("recipes.deletedMessage"),
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
    });
  };

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
            h={{ base: 230, sm: 190 }}
            alt={recipe.title}
            className={styles.cardImage}
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
          <Text className={styles.cardTitle} id={`recipe-title-${recipe._id}`}>
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
        <div className={styles.cardStats}>
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
        <div className={styles.cardFooter}>
          <div className={styles.footerActions}>
            <ActionIcon color="blue" variant="subtle" onClick={handleEdit}>
              <IconEdit size={18} />
            </ActionIcon>
            <ActionIcon color="red" variant="subtle" onClick={handleDelete}>
              <IconTrash size={18} />
            </ActionIcon>
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
