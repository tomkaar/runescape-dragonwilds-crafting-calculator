/**
 * Types representing an item.
 * Can potentially represent multiple variants of the same item.
 * Example items with variants: "Wall" and "Wall (Cabin)"
 */
export type Item = {
  /* A hashed version of the item name */
  id: string;
  /* The name of the item */
  name: string;
  /* A parsed URL to an image representing the item. Use first variant's image if multiple variants exist */
  image: string | null;
  /* All available variants for this item, can be one or many */
  variants: ItemVariant[];
  /* Facilities where this item can be crafted */
  facilities: ((typeof Facility)[number] | null)[];
  /* Skills required to craft this item */
  skills?: ((typeof Skill)[number] | null)[];
  /* Link to the wiki page for this item, if possible */
  wikiLink?: string;
  /* Weight of the item in kg */
  weight?: number;
};

/**
 * Types representing a specific variant of an item and its recipes.
 */
export type ItemVariant = {
  /* A hashed version of the variant name + variantName */
  id: string;
  /* The name of the variant (example: "Wall") */
  name: string;
  /* A parsed URL to an image representing the item. Use first variant's image if multiple variants exist */
  image: string | null;
  /* The name of the variant (example: "Cabin") */
  /* Can be parsed from the item image */
  variantName: string | null;
  /* The recipes associated with this variant */
  recipe: Recipe | null;
  /* Recipe unlocks required to craft this variant (e.g. vestiges, patterns) */
  usesRecipe: string[] | null;
};

/**
 * A crafting recipe, its required materials, and facilities.
 */
export type Recipe = {
  /**
   * Generated from the recipe materials and facility.
   * */
  id: string;
  /* Facility required to craft the recipe */
  facility: (typeof Facility)[number] | null;
  /* Quantity produced by this recipe */
  quantity: number;
  /* List of materials required to craft the recipe */
  materials: Material[];
};

/**
 * A material required for crafting, either an item or another recipe.
 * Includes the quantity needed.
 */
export type Material = {
  /**
   * All additional info regarding the material can be found by looking up the item by its ID.
   */
  itemId: Item["id"];
  /* The quantity of the material required */
  quantity: number;
};

export const Facility = [
  "Blast Furnace",
  "Brewing Cauldron",
  "Build Menu",
  "Campfire",
  "Cooking Range",
  "Crafting Table",
  "Fletching Bench",
  "Furnace",
  "Grill",
  "Grindstone",
  "Jeweler's Bench",
  "Kiln",
  "Loom",
  "Lougrim's Shrine",
  "Pottery Wheel",
  "Rune Altar",
  "Sawmill",
  "Smithing Anvil",
  "Smithing Forge",
  "Spinning Wheel",
  "Stonecutter",
  "Tannery",
] as const;

/**
 * A parsed facility entry with a hashed ID and display name.
 */
export type FacilityData = {
  id: string;
  name: string;
};

export const Skill = [
  "Artisan",
  "Construction",
  "Cooking",
  "Farming",
  "Runecrafting",
] as const;
