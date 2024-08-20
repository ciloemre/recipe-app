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
import { Recipe } from "../../../../types/types";
import styles from "./MyRecipesCard.module.css";
import { openDeleteConfirmModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";

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
  const [recipe, setRecipe] = useState(initialRecipe);
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate(`/recipe/${recipe._id}?edit=true`);
  };

  const handleDelete = () => {
    openDeleteConfirmModal("Tarifi", () => {
      onDeleteRecipe(recipe._id)
        .then(() => {
          showDeleteNotification();
        })
        .catch((error) => {
          console.error("Silme işlemi sırasında hata oluştu:", error);
        });
    });
  };

  const showDeleteNotification = () => {
    notifications.show({
      title: "Tarif Silindi",
      message: "Tarif başarıyla silindi.",
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
    });
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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
            height={160}
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
            className={styles.ratingBadge}
          >
            {recipe.averageRating.toFixed(1)}
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
          <Group gap={5}>
            <IconStar size={18} />
            <Text size="sm">{recipe.ratings?.length || 0}</Text>
          </Group>
          <Group gap={5}>
            <IconMessageCircle size={18} />
            <Text size="sm">{recipe.comments.length}</Text>
          </Group>
        </div>
        <div className={styles.cardFooter}>
          <Group>
            <ActionIcon color="blue" variant="subtle" onClick={handleEdit}>
              <IconEdit size={18} />
            </ActionIcon>
            <ActionIcon color="red" variant="subtle" onClick={handleDelete}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
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
