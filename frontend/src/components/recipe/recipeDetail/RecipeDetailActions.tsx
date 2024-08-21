import React from "react";
import { Group, Text, Tooltip, ActionIcon, Badge, Rating } from "@mantine/core";
import { IconHeart, IconMessageCircle, IconStar } from "@tabler/icons-react";
import { CustomButton } from "../../atoms/CustomButton";
import { useSocket } from "../../../hooks/useSocket";
import { useRecipe } from "../../../contexts/RecipeContext";

interface RecipeActionsProps {
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
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
  const { emit } = useSocket();
  const { updateFavoriteStatus } = useRecipe();

  const handleToggleFavorite = async () => {
    await toggleFavorite();
    updateFavoriteStatus(recipeId, !isFavorite);
    emit("favoriteToggled", { recipeId, isFavorite: !isFavorite });
  };

  const handleRating = async (value: number) => {
    await onRating(value);
  };

  return (
    <Group p="apart" mt="xl">
      <Tooltip label={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}>
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
        <IconMessageCircle size={20} style={{ marginRight: "10px" }} />
        Yorumlar
        <Badge ml="xs" variant="filled" size="sm" color="orange">
          {commentCount}
        </Badge>
      </CustomButton>

      <Group gap="xs">
        <IconStar size={24} color="orange" />
        <Text size="lg" fw={700}>
          {averageRating.toFixed(1)}
        </Text>
        <Text size="sm" c="dimmed">
          ({ratingCount} değerlendirme)
        </Text>
        <Rating value={averageRating} onChange={handleRating} />
      </Group>
    </Group>
  );
};
