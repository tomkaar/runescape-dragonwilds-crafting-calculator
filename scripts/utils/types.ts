/* eslint-disable @typescript-eslint/no-explicit-any */

// Type definitions for infobox_item JSON
export interface InfoboxItemJson {
  name?: string;
  image?: string;
  release?: string;
  update?: string;
  removal?: string;
  aka?: string;
  members?: boolean | string;
  quest?: string;
  tradeable?: boolean | string;
  equipable?: boolean | string;
  stackable?: boolean | string;
  noteable?: boolean | string;
  options?: string[];
  destroy?: string;
  examine?: string;
  value?: number | string;
  weight?: number | string;
  exchange?: string;
  id?: number | string;
  [key: string]: any;
}

export interface InfoboxItem {
  page_name?: string;
  page_name_sub?: string;
  item_name?: string;
  item_type?: string;
  item_repair?: string;
  item_weight?: string;
  item_stacklimit?: string;
  item_description?: string;
  perk_name?: string;
  json?: InfoboxItemJson;
}

// Type definitions for recipe JSON
export interface RecipeMaterial {
  quantity: string;
  name: string;
  link: string;
  qty?: string;
  item?: string;
  image?: string;
}

export interface RecipeSkill {
  name: string;
  experience: string;
}

export interface RecipeOutput {
  quantity: number | string;
  name: string;
  link: string;
  qty?: number | string;
  item?: string;
  image?: string;
}

export interface RecipeJson {
  facility?: string;
  materials?: RecipeMaterial[];
  skills?: RecipeSkill[];
  outputs?: string[];
  output?: RecipeOutput;
  [key: string]: any;
}

export interface Recipe {
  uses_material?: string;
  uses_facility?: string;
  output?: string;
  uses_skill?: string;
  uses_recipe?: string;
  json?: RecipeJson;
}
