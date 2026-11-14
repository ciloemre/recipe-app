import { useState, useEffect, useCallback, useMemo } from "react";
import { TextInput, ActionIcon, Box, Select, Group } from "@mantine/core";
import { IconSearch, IconAdjustments } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
  onSearch: (query: string, category: string, sortBy: string) => void;
}

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const debouncedCallback = useCallback(
    (...args: any[]) => {
      const handler = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(handler);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = useMemo(
    () => [
      { value: "all", label: t("categoryLabels.all") },
      { value: "Ana Yemek", label: t("categoryLabels.AnaYemek") },
      { value: "Ara Sıcak", label: t("categoryLabels.AraSicak") },
      { value: "Çorba", label: t("categoryLabels.Corba") },
      { value: "Tatlı", label: t("categoryLabels.Tatli") },
      { value: "Salata", label: t("categoryLabels.Salata") },
      { value: "Kahvaltılık", label: t("categoryLabels.Kahvaltilik") },
      { value: "Atıştırmalık", label: t("categoryLabels.Atistirmalik") },
      { value: "İçecek", label: t("categoryLabels.Icecek") },
      { value: "Vegan", label: t("categoryLabels.Vegan") },
      { value: "Vejetaryen", label: t("categoryLabels.Vejetaryen") },
      { value: "Glutensiz", label: t("categoryLabels.Glutensiz") },
    ],
    [t]
  );

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: t("recipes.newest") },
      { value: "rating", label: t("recipes.topRated") },
    ],
    [t]
  );

  const debouncedSearch = useDebounce(
    (query: string, cat: string, sort: string) => {
      onSearch(query, cat, sort);
    },
    300
  );

  useEffect(() => {
    debouncedSearch(searchQuery, category, sortBy);
  }, [searchQuery, category, sortBy, debouncedSearch]);

  const handleCategoryChange = (value: string | null) => {
    setCategory(value || "all");
  };

  const handleSortChange = (value: string | null) => {
    setSortBy(value || "newest");
  };

  return (
    <Box className={styles.searchForm}>
      <Group className={styles.group}>
        <TextInput
          className={styles.textInput}
          leftSection={<IconSearch className={styles.searchIcon} />}
          placeholder={t("recipes.searchPlaceholder")}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <Select
          data={categories}
          value={category}
          onChange={handleCategoryChange}
          placeholder={t("recipes.category")}
          className={styles.select}
        />
        <Select
          data={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
          placeholder={t("recipes.sort")}
          className={styles.select}
        />
        <ActionIcon className={styles.actionIcon}>
          <IconAdjustments className={styles.icon} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
