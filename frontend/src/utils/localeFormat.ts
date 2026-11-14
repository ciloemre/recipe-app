const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar-EG",
};

export function resolveLocale(lang?: string): string {
  const code = (lang || "tr").slice(0, 2);
  return LOCALE_MAP[code] || LOCALE_MAP.tr;
}

export function formatLocaleNumber(
  value: number | string,
  lang?: string,
  options?: Intl.NumberFormatOptions
): string {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return String(value);
  return new Intl.NumberFormat(resolveLocale(lang), options).format(num);
}

export function formatLocaleRating(value: number, lang?: string): string {
  return formatLocaleNumber(value, lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatLocaleDate(
  value: string | Date,
  lang?: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(resolveLocale(lang), options);
}

export function formatLocaleDateTime(value: string | Date, lang?: string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(resolveLocale(lang));
}
