// Type definitions for recipe JSON
interface RecipeMaterial {
  quantity: string;
  name: string;
  link: string;
  qty?: string;
  item?: string;
  image?: string;
}

interface RecipeSkill {
  name: string;
  experience: string;
}

interface RecipeOutput {
  quantity: number | string;
  name: string;
  link: string;
  qty?: number | string;
  item?: string;
  image?: string;
}

interface RecipeJson {
  facility?: string;
  materials?: RecipeMaterial[];
  skills?: RecipeSkill[];
  outputs?: string[];
  output?: RecipeOutput;
  [key: string]: unknown;
}

interface Recipe {
  uses_material?: string;
  uses_facility?: string;
  output?: string;
  uses_skill?: string;
  uses_recipe?: string;
  json?: RecipeJson;
}
