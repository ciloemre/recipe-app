import { Request, Response } from "express";
import { translateTexts, TranslateTarget } from "../services/translateService";

const SUPPORTED: TranslateTarget[] = ["en", "ar"];

function isTargetLang(value: unknown): value is TranslateTarget {
  return typeof value === "string" && SUPPORTED.includes(value as TranslateTarget);
}

export async function translateText(req: Request, res: Response) {
  try {
    const { text, targetLang } = req.body as {
      text?: string;
      targetLang?: string;
    };

    if (typeof text !== "string" || !text.trim() || !isTargetLang(targetLang)) {
      return res.status(400).json({
        message: "text and targetLang (en|ar) are required",
      });
    }

    const translated = await translateTexts([text], targetLang);
    if (!translated?.[0]) {
      return res.json({
        targetLang,
        fallback: true,
        text,
        translatedText: text,
      });
    }

    return res.json({
      targetLang,
      fallback: false,
      text,
      translatedText: translated[0],
    });
  } catch (error) {
    console.error("translateText error:", error);
    return res.status(500).json({ message: "Translation failed" });
  }
}
