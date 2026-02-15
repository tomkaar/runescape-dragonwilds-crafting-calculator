/**
 * Resolve image for item, with fallback to items data if not found in recipe
 */

import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { extractImageFilename } from "./image-url";
import { SourceItem } from "@/scripts/fetch-data/types/item";
import { resolveConfiguredImage } from "../image-config";

export function resolveImage(
  firstRecipe: SourceRecipe | undefined,
  items: SourceItem[],
  itemName: string,
) {
  const configuredImage = resolveConfiguredImage(firstRecipe, itemName);
  if (configuredImage) {
    return configuredImage;
  }

  let image = extractImageFilename(firstRecipe?.json.output.image || "");
  if (image === null) {
    image = items.find((i) => i.page_name === itemName)?.json.image_raw || null;
  }
  return image;
}
