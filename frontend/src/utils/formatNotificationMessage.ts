import type { TFunction } from "i18next";
import type { AppNotification } from "../api/api";

function extractQuotes(message: string): string[] {
  const values: string[] = [];
  const seen = new Set<string>();
  const pattern = /[“"«]([^”"»]+)[”"»]/g;
  for (const match of message.matchAll(pattern)) {
    const value = match[1]?.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
  }
  return values;
}

export function formatNotificationMessage(
  item: AppNotification,
  t: TFunction
): string {
  const quotes = extractQuotes(item.message || "");
  const rating =
    item.message?.match(/(\d+)\s*yıldız/)?.[1] ||
    item.message?.match(/\b(\d+)\b/)?.[1] ||
    "";

  switch (item.type) {
    case "RECIPE_COMMENT":
      return quotes[0]
        ? t("notifications.commented", { text: quotes[0] })
        : t("notifications.commentedPlain");
    case "RECIPE_FAVORITE":
      return t("notifications.favorited");
    case "RECIPE_RATING":
      return t("notifications.rated", { rating });
    case "COMMENT_LIKE":
    case "REPLY_LIKE":
      return t("notifications.likedComment", {
        text: quotes[0] || "",
      });
    case "COMMENT_REPLY":
      return t("notifications.replied", {
        parent: quotes[0] || "",
        reply: quotes[1] || quotes[0] || "",
      });
    case "USER_FOLLOW":
      return t("notifications.followed");
    case "RECIPE_SHARED":
      return t("notifications.shared", {
        title: quotes[0] || item.recipe?.title || "",
      });
    default:
      return item.message;
  }
}
