import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  translateRecipeContent,
  RecipeTranslationResult,
} from "../api/api";
import { Recipe } from "../types/types";
import { AppLocale, isAppLocale } from "../i18n";

type DisplayRecipe = Recipe & {
  translationFallback?: boolean;
};

export function useRecipeTranslation(recipe: Recipe | null) {
  const { i18n } = useTranslation();
  const locale = (i18n.language?.slice(0, 2) || "tr") as AppLocale;
  const [translated, setTranslated] = useState<RecipeTranslationResult | null>(
    null
  );
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!recipe?._id || !isAppLocale(locale) || locale === "tr") {
        setTranslated(null);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      try {
        const result = await translateRecipeContent(
          recipe._id,
          locale as "en" | "ar"
        );
        if (!cancelled) setTranslated(result);
      } catch {
        if (!cancelled) setTranslated(null);
      } finally {
        if (!cancelled) setIsTranslating(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [recipe?._id, recipe?.updatedAt, locale]);

  const displayRecipe = useMemo<DisplayRecipe | null>(() => {
    if (!recipe) return null;
    if (!translated || locale === "tr") return recipe;

    return {
      ...recipe,
      title: translated.title,
      description: translated.description,
      ingredients: translated.ingredients,
      instructions: translated.instructions,
      translationFallback: !!translated.fallback,
    };
  }, [recipe, translated, locale]);

  return {
    displayRecipe,
    isTranslating,
    locale,
    showFallbackNotice: !!translated?.fallback && locale !== "tr",
  };
}
