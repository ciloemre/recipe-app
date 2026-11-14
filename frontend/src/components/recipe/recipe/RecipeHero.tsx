import { Box, Text, Paper, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../../atoms/CustomButton";
import { SearchForm } from "./searchForm/SearchForm";
import styles from "./RecipeHero.module.css";

interface RecipeHeroProps {
  onSearch: (query: string, category: string, sortBy: string) => void;
}

export function RecipeHero({ onSearch }: RecipeHeroProps) {
  const { t } = useTranslation();

  return (
    <Paper className={styles.recipeHero}>
      <Box className={styles.overlay} />
      <Group className={styles.buttonGroup}>
        <Link to="/recipe-form">
          <CustomButton variant="filled" className={styles.addButton}>
            <IconPlus size={18} className={styles.plusIcon} />
            {t("recipes.addNew")}
          </CustomButton>
        </Link>
      </Group>
      <Box className={styles.contentBox}>
        <Text className={styles.title}>{t("recipes.heroTitle")}</Text>
        <Text className={styles.description}>{t("recipes.heroSubtitle")}</Text>
        <SearchForm onSearch={onSearch} />
      </Box>
    </Paper>
  );
}
