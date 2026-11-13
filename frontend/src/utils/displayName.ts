type NamedPerson = {
  username?: string | null;
  name?: string | null;
};

export function displayPersonName(
  person: string | NamedPerson | null | undefined,
  fallback: string
): string {
  if (!person) return fallback;

  if (typeof person === "string") {
    const value = person.trim();
    return value || fallback;
  }

  const name = person.name?.trim();
  if (name) return name;

  const username = person.username?.trim();
  if (username) return username;

  return fallback;
}
