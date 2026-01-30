function extractImageFilename(imageMarkup?: string): string | null {
  if (!imageMarkup) return null;
  // Extract filename from markup like "[[File:Burnt Tomato.png|30px|link=Burnt Tomato]]"
  const match = imageMarkup.match(/\[\[File:([^\|]+)/);
  return match ? match[1] : null;
}

export function createImageUrl(imageMarkup?: string): string | null {
  const filename = extractImageFilename(imageMarkup);
  if (!filename) return null;

  // Encode the filename for URL - replace spaces with underscores and encode special chars
  const encodedFilename = filename
    .replace(/ /g, "_")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return `https://dragonwilds.runescape.wiki/images/${encodedFilename}`;
}
