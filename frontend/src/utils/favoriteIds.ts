export function toFavoriteIds(
  favorites: Array<string | { _id?: string } | null | undefined>
): string[] {
  return favorites
    .map((favorite) => {
      if (!favorite) return "";
      if (typeof favorite === "string") return favorite;
      return favorite._id ? String(favorite._id) : "";
    })
    .filter(Boolean);
}
