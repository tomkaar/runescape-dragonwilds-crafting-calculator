export type RecipesRoot = RawRecipe[];

export interface RawRecipe {
  uses_material?: string[];
  uses_skill?: string[];
  uses_facility: string[];
  json: Json;
  output: string[];
  uses_recipe?: string[];
}

export interface Json {
  facility: string;
  materials: Material[];
  skills: Skill[];
  outputs: string[];
  output: Output;
  recipe?: string;
}

export interface Material {
  quantity: string | number;
  name: string;
  link: string;

  item: string;
  image: string;
}

export interface Skill {
  name: string;
  experience: string;
}

export interface Output {
  quantity: string | number;
  name: string;
  link: string;
  qty: string | number;
  item: string;
  image: string;
}
