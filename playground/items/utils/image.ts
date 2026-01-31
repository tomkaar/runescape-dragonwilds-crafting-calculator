/**
 * Extract filename from markup like "[[File:Burnt Tomato.png|30px|link=Burnt Tomato]]"
 */
export function extractImageFilename(imageMarkup?: string): string | null {
  if (!imageMarkup) return null;
  const match = imageMarkup.match(/\[\[File:([^\|]+)/);
  return match ? match[1] : null;
}

/**
 * Encode the filename for URL - replace spaces with underscores and encode special chars
 */
export function createImageUrlPath(filename: string): string {
  const encodedFilename = filename
    .replace(/ /g, "_")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return `https://dragonwilds.runescape.wiki/images/${encodedFilename}`;
}
