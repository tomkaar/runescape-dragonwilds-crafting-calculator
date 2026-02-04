export default function variantFromImage(image?: string): string | null {
  if (!image) return null;
  // Extract variant from image filename like "[[File:Wall (Cabin).png|30px|link=Wall]]"
  const match = image.match(/\[\[File:[^\(]+\(([^\)]+)\)/);
  return match ? match[1] : null;
}
