import React from "react";
import { Stack, Group, Text } from "@mantine/core";
import { IconClock, IconCooker, IconUsers } from "@tabler/icons-react";

interface RecipeMetaInfoProps {
  prepTime: number;
  cookTime: number;
  servings: string;
}

export const RecipeMetaInfo: React.FC<RecipeMetaInfoProps> = ({
  prepTime,
  cookTime,
  servings,
}) => (
  <Stack gap="md">
    <Group>
      <IconClock size={20} />
      <Text>Hazırlık Süresi: {prepTime} dakika</Text>
    </Group>
    <Group>
      <IconCooker size={20} />
      <Text>Pişirme Süresi: {cookTime} dakika</Text>
    </Group>
    <Group>
      <IconUsers size={20} />
      <Text>Porsiyon: {servings}</Text>
    </Group>
  </Stack>
);
