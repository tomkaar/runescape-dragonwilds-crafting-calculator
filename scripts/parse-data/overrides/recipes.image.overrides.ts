import { RecipeImageOverride } from "./types";

/**
 * Add manual image overrides here when source recipe output image is too generic.
 * `usesMaterial` is matched as an exact set (order-insensitive).
 */
export const recipeImageOverrides: RecipeImageOverride[] = [
  // 30° Stairs
  {
    output: "30° Stairs",
    usesMaterial: ["Ash Logs"],
    image: "30°_Stairs_%28Cabin%29.png",
  },
  {
    output: "30° Stairs",
    usesMaterial: ["Oak Logs"],
    image: "30°_Stairs_%28Cottage%29.png",
  },
  {
    output: "30° Stairs",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/30°_Stairs_%28Castle%29.png/500px-30°_Stairs_%28Castle%29.png",
  },
  // 45° Stairs
  {
    output: "45° Stairs",
    usesMaterial: ["Ash Logs"],
    image: "45°_Stairs_%28Cabin%29.png",
  },
  {
    output: "45° Stairs",
    usesMaterial: ["Oak Logs"],
    image: "45°_Stairs_%28Cottage%29.png",
  },
  {
    output: "45° Stairs",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/45°_Stairs_%28Castle%29.png/500px-45°_Stairs_%28Castle%29.png",
  },
  // 45° Corner Stairs
  {
    output: "Inner Corner 45° Stairs",
    usesMaterial: ["Ash Logs"],
    image: "Inner_Corner_45°_Stairs_%28Cabin%29.png",
  },
  {
    output: "Inner Corner 45° Stairs",
    usesMaterial: ["Oak Logs"],
    image: "Inner_Corner_45°_Stairs_%28Cottage%29.png",
  },
  {
    output: "Inner Corner 45° Stairs",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Inner_Corner_45°_Stairs_%28Castle%29.png/500px-Inner_Corner_45°_Stairs_%28Castle%29.png",
  },
  // Outer Corner 45° Stairs
  {
    output: "Outer Corner 45° Stairs",
    usesMaterial: ["Ash Logs"],
    image: "Outer_Corner_45°_Stairs_%28Cabin%29.png",
  },
  {
    output: "Outer Corner 45° Stairs",
    usesMaterial: ["Oak Logs"],
    image: "Outer_Corner_45°_Stairs_%28Cottage%29.png",
  },
  {
    output: "Outer Corner 45° Stairs",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Outer_Corner_45°_Stairs_%28Castle%29.png/500px-Outer_Corner_45°_Stairs_%28Castle%29.png",
  },
  // Medium Square Foundation
  {
    output: "Medium Square Foundation",
    usesMaterial: ["Ash Logs"],
    image: "Medium_Square_Foundation_%28Cabin%29.png",
  },
  {
    output: "Medium Square Foundation",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Medium_Square_Foundation_%28Cottage%29.png",
  },
  {
    output: "Medium Square Foundation",
    usesMaterial: ["Stone Block", "Oak Plank"],
    image:
      "thumb/Medium_Square_Foundation_%28Castle%29.png/500px-Medium_Square_Foundation_%28Castle%29.png",
  },
  // Medium Square Tile
  {
    output: "Medium Square Tile",
    usesMaterial: ["Ash Logs"],
    image: "Medium_Square_Tile_%28Cabin%29.png",
  },
  {
    output: "Medium Square Tile",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Medium_Square_Tile_%28Cottage%29.png",
  },
  {
    output: "Medium Square Tile",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Medium_Square_Tile_%28Castle%29.png/500px-Medium_Square_Tile_%28Castle%29.png",
  },
  // Medium Triangular Foundation
  {
    output: "Medium Triangular Foundation",
    usesMaterial: ["Ash Logs", "Stone"],
    image: "Medium_Triangular_Foundation_%28Cabin%29.png",
  },
  {
    output: "Medium Triangular Foundation",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Medium_Triangular_Foundation_%28Cottage%29.png",
  },
  {
    output: "Medium Triangular Foundation",
    usesMaterial: ["Stone Block", "Oak Plank"],
    image:
      "thumb/Medium_Triangular_Foundation_%28Castle%29.png/500px-Medium_Triangular_Foundation_%28Castle%29.png",
  },

  {
    output: "Medium Triangular Tile",
    usesMaterial: ["Ash Logs"],
    image: "Medium_Triangular_Tile_%28Cabin%29.png",
  },
  {
    output: "Medium Triangular Tile",
    usesMaterial: ["Oak Logs"],
    image: "Medium_Triangular_Tile_%28Cottage%29.png",
  },
  {
    output: "Medium Triangular Tile",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Medium_Triangular_Tile_%28Castle%29.png/500px-Medium_Triangular_Tile_%28Castle%29.png",
  },
  // Small Square Tile
  {
    output: "Small Square Tile",
    usesMaterial: ["Ash Logs"],
    image: "Small_Square_Tile_%28Cabin%29.png",
  },
  {
    output: "Small Square Tile",
    usesMaterial: ["Oak Logs"],
    image: "Small_Square_Tile_%28Cottage%29.png",
  },
  {
    output: "Small Square Tile",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Small_Square_Tile_%28Castle%29.png/500px-Small_Square_Tile_%28Castle%29.png",
  },
  // Square Foundation
  {
    output: "Square Foundation",
    usesMaterial: ["Ash Logs"],
    image: "Square_Foundation_%28Cabin%29.png",
  },
  {
    output: "Square Foundation",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Square_Foundation_%28Cottage%29.png",
  },
  {
    output: "Square Foundation",
    usesMaterial: ["Stone Block", "Oak Plank"],
    image:
      "thumb/Square_Foundation_%28Castle%29.png/500px-Square_Foundation_%28Castle%29.png",
  },
  // Square Tile
  {
    output: "Square Tile",
    usesMaterial: ["Ash Logs"],
    image: "Square_Tile_%28Cabin%29.png",
  },
  {
    output: "Square Tile",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Square_Tile_%28Cottage%29.png",
  },
  {
    output: "Square Tile",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Square_Tile_%28Castle%29.png/500px-Square_Tile_%28Castle%29.png",
  },
  // Triangular Foundation/Tile
  {
    output: "Triangular Foundation",
    usesMaterial: ["Ash Logs", "Stone"],
    image: "Triangular_Foundation_%28Cabin%29.png",
  },
  {
    output: "Triangular Foundation",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Triangular_Foundation_%28Cottage%29.png",
  },
  {
    output: "Triangular Foundation",
    usesMaterial: ["Stone Block", "Oak Plank"],
    image:
      "thumb/Triangular_Foundation_%28Castle%29.png/500px-Triangular_Foundation_%28Castle%29.png",
  },
  // Triangular Tile
  {
    output: "Triangular Tile",
    usesMaterial: ["Ash Logs"],
    image: "Triangular_Tile_%28Cabin%29.png",
  },
  {
    output: "Triangular Tile",
    usesMaterial: ["Ash Plank", "Oak Logs"],
    image: "Triangular_Tile_%28Cottage%29.png",
  },
  {
    output: "Triangular Tile",
    usesMaterial: ["Stone Block"],
    image:
      "thumb/Triangular_Tile_%28Castle%29.png/500px-Triangular_Tile_%28Castle%29.png",
  },
];
