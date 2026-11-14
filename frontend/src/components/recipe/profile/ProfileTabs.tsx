import { Tabs } from "@mantine/core";
import { IconChefHat, IconStar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface ProfileTabsProps {
  activeTab: string | null;
  onTabChange: (value: string | null) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="myRecipes" leftSection={<IconChefHat size={14} />}>
          {t("profile.myRecipes")}
        </Tabs.Tab>
        <Tabs.Tab value="favoriteRecipes" leftSection={<IconStar size={14} />}>
          {t("profile.myFavorites")}
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
