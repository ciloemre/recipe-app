import React from "react";
import { Group, Text, Tooltip, ActionIcon, Badge, Rating } from "@mantine/core";
import { IconHeart, IconMessageCircle, IconStar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../../atoms/CustomButton";
import { useSocket } from "../../../hooks/useSocket";
import { useRecipe } from "../../../contexts/RecipeContext";
import {
  formatLocaleNumber,
  formatLocaleRating,
} from "../../../utils/localeFormat";

interface RecipeActionsProps {
  isFavorite: boolean;
  toggleFavorite: () => Promise<boolean | void>;
  commentCount: number;
  scrollToComments: () => void;
  ratingCount: number;
  averageRating: number;
  onRating: (value: number) => Promise<void>;
  recipeId: string;
}

export const RecipeActions: React.FC<RecipeActionsProps> = ({
  isFavorite,
  toggleFavorite,
  commentCount,
  scrollToComments,
  ratingCount,
  averageRating,
  onRating,
  recipeId,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";
  const { emit } = useSocket();
  const { updateFavoriteStatus } = useRecipe();

  const handleToggleFavorite = async () => {
    const success = await toggleFavorite();
    if (success === false) return;
    updateFavoriteStatus(recipeId, !isFavorite);
    emit("favoriteToggled", { recipeId, isFavorite: !isFavorite });
  };

  const handleRating = async (value: number) => {
    await onRating(value);
  };

  return (
    <Group justify="space-between" mt="xl">
      <Tooltip
        label={
          isFavorite
            ? t("recipes.removeFavorite")
            : t("recipes.addFavorite")
        }
      >
        <ActionIcon
          color={isFavorite ? "red" : "gray"}
          variant="filled"
          onClick={handleToggleFavorite}
          size="xl"
          radius="xl"
        >
          <IconHeart size={24} />
        </ActionIcon>
      </Tooltip>

      <CustomButton
        color="orange"
        variant="light"
        onClick={scrollToComments}
        radius="xl"
        size="md"
      >
        <IconMessageCircle size={20} style={{ marginInlineEnd: "10px" }} />
        {t("detail.comments")}
        <Badge ms="xs" variant="filled" size="sm" color="orange">
          {formatLocaleNumber(commentCount, lang)}
        </Badge>
      </CustomButton>

      <Group gap="xs">
        <IconStar size={24} color="orange" />
        <Text size="lg" fw={700}>
          {formatLocaleRating(averageRating, lang)}
        </Text>
        <Text size="sm" c="dimmed">
          (
          {t("detail.ratings", {
            count: formatLocaleNumber(ratingCount, lang),
          })}
          )
        </Text>
        <Rating value={averageRating} onChange={handleRating} />
      </Group>
    </Group>
  );
};
