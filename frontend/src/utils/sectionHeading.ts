export const SECTION_HEADING_PREFIX = "@@h@@";

export type RecipeListField = "ingredients" | "instructions";

export interface AddListItemOptions {
  index?: number;
  heading?: boolean;
}

export function isSectionHeading(value: string): boolean {
  return value.startsWith(SECTION_HEADING_PREFIX);
}

export function sectionHeadingText(value: string): string {
  return isSectionHeading(value)
    ? value.slice(SECTION_HEADING_PREFIX.length)
    : value;
}

export function toSectionHeading(text: string): string {
  return `${SECTION_HEADING_PREFIX}${text}`;
}

export function listItemText(value: string): string {
  return sectionHeadingText(value).trim();
}

export function applyListAction(
  items: string[],
  action: "add" | "remove",
  index?: number,
  heading?: boolean
): string[] {
  if (action === "remove") {
    return items.filter((_, i) => i !== index);
  }

  const value = heading ? SECTION_HEADING_PREFIX : "";
  if (typeof index === "number") {
    const next = [...items];
    next.splice(index, 0, value);
    return next;
  }
  return [...items, value];
}
