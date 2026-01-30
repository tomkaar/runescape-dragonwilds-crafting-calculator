export const facilityIds = [
  "Anvil", // Anvil
  "Blast Furnace", // Microwave
  "Brewing Cauldron", // Anphore
  "Build Menu", // Hammer
  "Campfire", // FlameKindling
  "Cooking Range", // Cooking Pot
  "Crafting Table", // pencil-ruler
  "Fletching Bench", // Drafting Compass
  "Fletching Table", // Drafting Compass
  "Furnace", // brick-wall-fire
  "Grill", // brick-wall-fire
  "Grindstone", // stone
  "Jeweler's Bench", // gem
  "Kiln", // flame
  "Loom", // spool
  "Lougrim's Shrine",
  "Pottery Wheel", // brush-cleaning
  "Rune Altar", // wand-sparkles
  "Sawmill", // barrel
  "Smithing Anvil", // Anvil
  "Smithing Forge", // Anvil
  "Spinning Wheel", // spool
  "Stonecutter", // cake-slice
  "Tannery", //bird
] as const;

export type FacilityType = (typeof facilityIds)[number];
