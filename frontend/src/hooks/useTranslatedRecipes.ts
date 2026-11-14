import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateRecipeContent } from "../api/api";
import { Recipe } from "../types/types";
import { AppLocale, isAppLocale } from "../i18n";

type Fields = {
  title: string;
  description: string;
};

const cache = new Map<string, Fields>();
const inflight = new Map<string, Promise<Fields | null>>();

function cacheKey(id: string, locale: string) {
  return `${id}:${locale}`;
}

async function translateCard(
  recipeId: string,
  locale: "en" | "ar"
): Promise<Fields | null> {
  const key = cacheKey(recipeId, locale);
  const cached = cache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    try {
      const result = await translateRecipeContent(recipeId, locale, "card");
      if (result.fallback) return null;
      const fields: Fields = {
        title: result.title,
        description: result.description,
      };
      cache.set(key, fields);
      return fields;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  }

  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    run()
  );
  await Promise.all(runners);
  return results;
}

export function useTranslatedRecipes(recipes: Recipe[]) {
  const { i18n } = useTranslation();
  const locale = (i18n.language?.slice(0, 2) || "tr") as AppLocale;
  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;

  const ids = useMemo(
    () => recipes.map((recipe) => recipe._id).filter(Boolean).join(","),
    [recipes]
  );

  const [map, setMap] = useState<Record<string, Fields>>({});

  useEffect(() => {
    let cancelled = false;

    if (!isAppLocale(locale) || locale === "tr" || !ids) {
      setMap({});
      return;
    }

    const current = recipesRef.current;
    const initial: Record<string, Fields> = {};
    const missing: Recipe[] = [];

    for (const recipe of current) {
      const hit = cache.get(cacheKey(recipe._id, locale));
      if (hit) initial[recipe._id] = hit;
      else missing.push(recipe);
    }

    setMap(initial);

    if (missing.length === 0) return;

    const run = async () => {
      const next = { ...initial };

      await mapPool(missing, 3, async (recipe) => {
        const fields = await translateCard(
          recipe._id,
          locale as "en" | "ar"
        );
        if (fields) next[recipe._id] = fields;
        return fields;
      });

      if (!cancelled) setMap({ ...next });
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [ids, locale]);

  return useMemo(
    () =>
      recipes.map((recipe) => {
        const translated = map[recipe._id];
        if (!translated) return recipe;
        return {
          ...recipe,
          title: translated.title,
          description: translated.description,
        };
      }),
    [recipes, map]
  );
}
