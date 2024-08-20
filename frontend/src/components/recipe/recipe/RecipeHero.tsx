import { Box, Text, Paper, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { CustomButton } from "../../atoms/CustomButton";
import { SearchForm } from "./searchForm/SearchForm";
import styles from "./RecipeHero.module.css";

interface RecipeHeroProps {
  onSearch: (query: string, category: string, sortBy: string) => void;
}

export function RecipeHero({ onSearch }: RecipeHeroProps) {
  return (
    <Paper className={styles.recipeHero}>
      <Box className={styles.overlay} />
      <Group className={styles.buttonGroup}>
        <Link to="/recipe-form">
          <CustomButton variant="filled" className={styles.addButton}>
            <IconPlus size={18} className={styles.plusIcon} />
            Yeni Tarif Ekle
          </CustomButton>
        </Link>
      </Group>
      <Box className={styles.contentBox}>
        <Text className={styles.title}>Lezzet Dünyası</Text>
        <Text className={styles.description}>
          Binlerce lezzetli tarif arasından size en uygun olanı bulun. Yemek
          yapmayı yeniden keşfedin ve sevdiklerinizi şaşırtın!
        </Text>
        <SearchForm onSearch={onSearch} />
      </Box>
    </Paper>
  );
}
