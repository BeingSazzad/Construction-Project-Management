/**
 * Collision-resistant unique ID generator for entities.
 * Generates structured, timestamped, nanoid-style unique identifiers.
 */
export function generateUniqueId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${randomPart}`;
}
