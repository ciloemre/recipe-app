import { useState, useEffect, useCallback } from "react";
import { TextInput, ActionIcon, Box, Select, Group } from "@mantine/core";
import { IconSearch, IconAdjustments } from "@tabler/icons-react";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
  onSearch: (query: string, category: string, sortBy: string) => void;
}

const categories = [
  { value: "all", label: "Tümü" },
  { value: "Ana Yemek", label: "Ana Yemek" },
  { value: "Ara Sıcak", label: "Ara Sıcak" },
  { value: "Çorba", label: "Çorba" },
  { value: "Tatlı", label: "Tatlı" },
  { value: "Salata", label: "Salata" },
  { value: "Kahvaltılık", label: "Kahvaltılık" },
  { value: "Atıştırmalık", label: "Atıştırmalık" },
  { value: "İçecek", label: "İçecek" },
  { value: "Vegan", label: "Vegan" },
  { value: "Vejetaryen", label: "Vejetaryen" },
  { value: "Glutensiz", label: "Glutensiz" },
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "rating", label: "En Yüksek Puan" },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const debouncedSearch = useDebounce(
    (query: string, category: string, sortBy: string) => {
      onSearch(query, category, sortBy);
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
          placeholder="Tarif ara..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <Select
          data={categories}
          value={category}
          onChange={handleCategoryChange}
          placeholder="Kategori"
          className={styles.select}
        />
        <Select
          data={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
          placeholder="Sırala"
          className={styles.select}
        />
        <ActionIcon className={styles.actionIcon}>
          <IconAdjustments className={styles.icon} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
