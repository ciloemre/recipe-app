import axios from "axios";
import crypto from "crypto";

export type TranslateTarget = "en" | "ar";

export function hashRecipeContent(parts: {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}) {
  const payload = JSON.stringify({
    title: parts.title,
    description: parts.description,
    ingredients: parts.ingredients,
    instructions: parts.instructions,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function translateViaLibre(
  text: string,
  target: TranslateTarget,
  apiUrl: string,
  apiKey?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    q: text,
    source: "tr",
    target,
    format: "text",
  };
  if (apiKey) body.api_key = apiKey;

  const response = await axios.post(
    `${apiUrl.replace(/\/$/, "")}/translate`,
    body,
    {
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
    }
  );

  const translated = response.data?.translatedText;
  if (typeof translated !== "string" || !translated.trim()) {
    throw new Error("Invalid LibreTranslate response");
  }
  return translated;
}

async function translateViaMyMemory(
  text: string,
  target: TranslateTarget
): Promise<string> {
  const response = await axios.get(
    "https://api.mymemory.translated.net/get",
    {
      params: {
        q: text.slice(0, 450),
        langpair: `tr|${target}`,
      },
      timeout: 15000,
    }
  );

  const translated = response.data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated.trim()) {
    throw new Error("Invalid MyMemory response");
  }

  const lower = translated.toLowerCase();
  if (
    lower.includes("please select two distinct languages") ||
    lower.includes("query length limit") ||
    lower.includes("my memory")
  ) {
    throw new Error("MyMemory quota or invalid response");
  }

  return translated;
}

async function translateOne(
  text: string,
  target: TranslateTarget
): Promise<string> {
  if (!text.trim()) return text;

  const apiUrl = process.env.TRANSLATE_API_URL?.trim();
  const apiKey = process.env.TRANSLATE_API_KEY?.trim();

  if (apiUrl) {
    try {
      return await translateViaLibre(text, target, apiUrl, apiKey);
    } catch (err) {
      console.warn("LibreTranslate failed, trying MyMemory:", err);
    }
  }

  return translateViaMyMemory(text, target);
}

export async function translateTexts(
  texts: string[],
  target: TranslateTarget
): Promise<string[] | null> {
  try {
    const results: string[] = [];
    for (const text of texts) {
      results.push(await translateOne(text, target));
    }
    return results;
  } catch (err) {
    console.error("translateTexts failed:", err);
    return null;
  }
}
