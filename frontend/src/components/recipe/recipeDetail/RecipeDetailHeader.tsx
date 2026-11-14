import React from "react";
import { Group, Badge, Button, Title } from "@mantine/core";
import {
  IconChefHat,
  IconCalendar,
  IconTag,
  IconCheck,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Recipe } from "../../../types/types";
import { openConfirmModal } from "../../../utils/modals";
import { notifications } from "@mantine/notifications";
import styles from "./RecipeDetailHeader.module.css";
import { displayPersonName } from "../../../utils/displayName";
import { AuthorFollow } from "./AuthorFollow";
import { categoryLabel } from "../../../utils/categoryLabel";
import { formatLocaleDate } from "../../../utils/localeFormat";

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
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";
  const authorName = displayPersonName(recipe.author, t("recipes.unknownChef"));
  const authorId =
    typeof recipe.author === "string" ? recipe.author : recipe.author?._id;

  const handleDeleteClick = () => {
    openConfirmModal(
      t("recipes.deleteTitle"),
      t("recipes.deleteMessage"),
      () => {
        onDeleteClick();
        notifications.show({
          title: t("recipes.deletedTitle"),
          message: t("recipes.deletedMessage"),
          color: "teal",
          icon: <IconCheck size="1.1rem" />,
        });
      },
      undefined,
      t("recipes.confirmDelete"),
      t("recipes.cancelDelete")
    );
  };

  return (
    <>
      <div className={styles.top}>
        <div className={styles.badgeGroup}>
          <Badge
            leftSection={<IconChefHat size={16} />}
            variant="light"
            size="lg"
            color="orange"
          >
            {authorName}
          </Badge>
          {authorId && <AuthorFollow authorId={authorId} />}
          <Badge
            leftSection={<IconCalendar size={16} />}
            variant="light"
            size="lg"
            color="yellow"
          >
            {formatLocaleDate(recipe.createdAt, lang)}
          </Badge>
          <Badge
            leftSection={<IconTag size={16} />}
            variant="light"
            size="lg"
            color="red"
          >
            {categoryLabel(recipe.category, t)}
          </Badge>
        </div>
        {isAuthor && (
          <Group className={styles.actions} gap="xs" wrap="wrap">
            <Button
              variant="light"
              color="orange"
              onClick={onEditClick}
              radius="md"
              size="sm"
            >
              {t("detail.edit")}
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={handleDeleteClick}
              radius="md"
              size="sm"
            >
              {t("detail.delete")}
            </Button>
          </Group>
        )}
      </div>
      <Title lineClamp={1} order={1} mt="lg">
        {recipe.title}
      </Title>
    </>
  );
};
