import { Tabs } from "@mantine/core";
import { IconChefHat, IconStar } from "@tabler/icons-react";

interface ProfileTabsProps {
  activeTab: string | null;
  onTabChange: (value: string | null) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="myRecipes" leftSection={<IconChefHat size={14} />}>
          Tariflerim
        </Tabs.Tab>
        <Tabs.Tab value="favoriteRecipes" leftSection={<IconStar size={14} />}>
          Favori Tariflerim
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
