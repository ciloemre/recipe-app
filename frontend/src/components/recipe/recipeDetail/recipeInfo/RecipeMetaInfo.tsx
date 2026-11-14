import React from "react";
import { Stack, Group, Text } from "@mantine/core";
import { IconClock, IconCooker, IconUsers } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { formatLocaleNumber } from "../../../../utils/localeFormat";

interface RecipeMetaInfoProps {
  prepTime: number;
  cookTime: number;
  servings: string;
}

export const RecipeMetaInfo: React.FC<RecipeMetaInfoProps> = ({
  prepTime,
  cookTime,
  servings,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";

  return (
    <Stack gap="md">
      <Group>
        <IconClock size={20} />
        <Text>
          {t("detail.prepTime", {
            count: formatLocaleNumber(prepTime, lang),
          })}
        </Text>
      </Group>
      <Group>
        <IconCooker size={20} />
        <Text>
          {t("detail.cookTime", {
            count: formatLocaleNumber(cookTime, lang),
          })}
        </Text>
      </Group>
      <Group>
        <IconUsers size={20} />
        <Text>
          {t("detail.servings", {
            count: formatLocaleNumber(servings, lang),
          })}
        </Text>
      </Group>
    </Stack>
  );
};
