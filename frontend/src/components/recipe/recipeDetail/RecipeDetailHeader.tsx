import React from "react";
import { Flex, Group, Badge, Button, Title } from "@mantine/core";
import {
  IconChefHat,
  IconCalendar,
  IconTag,
  IconCheck,
} from "@tabler/icons-react";
import { Recipe } from "../../../types/types";
import { openDeleteConfirmModal } from "../../../utils/modals";
import { notifications } from "@mantine/notifications";
import styles from "./RecipeDetailHeader.module.css";

interface RecipeHeaderProps {
  recipe: Recipe;
  isAuthor: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipe,
  isAuthor,
  onEditClick,
  onDeleteClick,
}) => {
  const authorName =
    typeof recipe.author === "object" && recipe.author !== null
      ? recipe.author.username || "Bilinmeyen Şef"
      : recipe.author || "Bilinmeyen Şef";

  const handleDeleteClick = () => {
    openDeleteConfirmModal("Tarifi", () => {
      onDeleteClick();
      showDeleteNotification();
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

  return (
    <>
      <Flex justify="space-between" align="flex-start">
        <div className={styles.badgeGroup}>
          <Badge
            leftSection={<IconChefHat size={16} />}
            variant="light"
            size="lg"
            color="orange"
          >
            {authorName}
          </Badge>
          <Badge
            leftSection={<IconCalendar size={16} />}
            variant="light"
            size="lg"
            color="yellow"
          >
            {new Date(recipe.createdAt).toLocaleDateString()}
          </Badge>
          <Badge
            leftSection={<IconTag size={16} />}
            variant="light"
            size="lg"
            color="red"
          >
            {recipe.category}
          </Badge>
        </div>
        {isAuthor && (
          <Group>
            <Button
              variant="light"
              color="orange"
              onClick={onEditClick}
              radius="md"
              size="sm"
            >
              Düzenle
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={handleDeleteClick}
              radius="md"
              size="sm"
            >
              Sil
            </Button>
          </Group>
        )}
      </Flex>
      <Title lineClamp={1} order={1} mt="lg">
        {recipe.title}
      </Title>
    </>
  );
};
