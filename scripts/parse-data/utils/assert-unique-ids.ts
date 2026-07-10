/**
 * Logs a warning if any two entries share the same id. Ids are used as lookup keys
 * throughout the app (e.g. materials reference items by id), so a collision
 * silently corrupts data instead of failing loudly.
 */
export function assertUniqueIds(
  label: string,
  entries: { id: string; name: string }[],
): void {
  const nameById = new Map<string, string>();
  const duplicates: string[] = [];

  entries.forEach(({ id, name }) => {
    const existingName = nameById.get(id);
    if (existingName === undefined) {
      nameById.set(id, name);
    } else if (existingName !== name) {
      duplicates.push(`"${id}" used by both "${existingName}" and "${name}"`);
    }
  });

  if (duplicates.length > 0) {
    console.warn(
      `Duplicate ${label} ids found:\n${duplicates.join("\n")}`,
    );
  }
}
