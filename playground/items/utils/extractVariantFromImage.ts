/**
 * Extract variant from image filename like "[[File:Wall (Cabin).png|30px|link=Wall]]"
 */
export function extractVariantFromImage(image?: string): string | null {
  if (!image) return null;
  const match = image.match(/\[\[File:[^\(]+\(([^\)]+)\)/);
  return match ? match[1] : null;
}
