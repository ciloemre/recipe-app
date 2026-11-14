import type { TFunction } from "i18next";

const CATEGORY_KEYS: Record<string, string> = {
  "Ana Yemek": "categoryLabels.AnaYemek",
  "Ara Sıcak": "categoryLabels.AraSicak",
  Çorba: "categoryLabels.Corba",
  Tatlı: "categoryLabels.Tatli",
  Salata: "categoryLabels.Salata",
  Kahvaltılık: "categoryLabels.Kahvaltilik",
  Atıştırmalık: "categoryLabels.Atistirmalik",
  İçecek: "categoryLabels.Icecek",
  Vegan: "categoryLabels.Vegan",
  Vejetaryen: "categoryLabels.Vejetaryen",
  Glutensiz: "categoryLabels.Glutensiz",
};

export function categoryLabel(category: string, t: TFunction): string {
  const key = CATEGORY_KEYS[category];
  return key ? t(key) : category;
}
