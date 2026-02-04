/**
 * Resolve image for item, with fallback to items data if not found in recipe
 */

import { extractImageFilename } from "./image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveImage(firstRecipe: any, items: any[], itemName: string) {
  let image = extractImageFilename(firstRecipe?.json.output.image || "");
  if (image === null) {
    image = items.find((i) => i.page_name === itemName)?.json.image_raw || null;
  }
  // if (image) {
  //   image = createImageUrlPath(image || "");
  // } else {
  //   console.warn("No image found for item after fallback:", itemName);
  // }
  return image;
}
