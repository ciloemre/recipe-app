import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import RecipeTranslation from "../models/RecipeTranslation";
import {
  hashRecipeContent,
  translateTexts,
  TranslateTarget,
} from "../services/translateService";

const SUPPORTED: TranslateTarget[] = ["en", "ar"];

function isTargetLang(value: unknown): value is TranslateTarget {
  return typeof value === "string" && SUPPORTED.includes(value as TranslateTarget);
}

export async function translateRecipe(req: Request, res: Response) {
  try {
    const { recipeId, targetLang, mode } = req.body as {
      recipeId?: string;
      targetLang?: string;
      mode?: "card" | "full";
    };
    const cardOnly = mode === "card";

    if (!recipeId || !isTargetLang(targetLang)) {
      return res.status(400).json({
        message: "recipeId and targetLang (en|ar) are required",
      });
    }

    const recipe = await Recipe.findById(recipeId).lean();
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const source = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
    };
    const sourceHash = hashRecipeContent(source);

    const cached = await RecipeTranslation.findOne({
      recipeId: recipe._id,
      targetLang,
    }).lean();

    if (cached && cached.sourceHash === sourceHash) {
      return res.json({
        recipeId,
        targetLang,
        cached: true,
        title: cached.title,
        description: cached.description,
        ingredients: cardOnly ? source.ingredients : cached.ingredients,
        instructions: cardOnly ? source.instructions : cached.instructions,
      });
    }

    const batch = cardOnly
      ? [source.title, source.description]
      : [
          source.title,
          source.description,
          ...source.ingredients,
          ...source.instructions,
        ];

    let translated: string[] | null = null;
    try {
      translated = await translateTexts(batch, targetLang);
    } catch (err) {
      console.error("Translate provider error:", err);
    }

    if (!translated) {
      return res.json({
        recipeId,
        targetLang,
        cached: false,
        fallback: true,
        title: source.title,
        description: source.description,
        ingredients: source.ingredients,
        instructions: source.instructions,
      });
    }

    const title = translated[0];
    const description = translated[1];

    if (cardOnly) {
      return res.json({
        recipeId,
        targetLang,
        cached: false,
        title,
        description,
        ingredients: source.ingredients,
        instructions: source.instructions,
      });
    }

    const ingredients = translated.slice(2, 2 + source.ingredients.length);
    const instructions = translated.slice(2 + source.ingredients.length);

    const saved = await RecipeTranslation.findOneAndUpdate(
      { recipeId: recipe._id, targetLang },
      {
        recipeId: recipe._id,
        targetLang,
        sourceHash,
        title,
        description,
        ingredients,
        instructions,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.json({
      recipeId,
      targetLang,
      cached: false,
      title: saved?.title ?? title,
      description: saved?.description ?? description,
      ingredients: saved?.ingredients ?? ingredients,
      instructions: saved?.instructions ?? instructions,
    });
  } catch (error) {
    console.error("translateRecipe error:", error);
    return res.status(500).json({ message: "Translation failed" });
  }
}
