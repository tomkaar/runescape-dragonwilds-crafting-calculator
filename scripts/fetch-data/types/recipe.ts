export interface SourceRecipe {
  uses_material?: string[];
  uses_skill?: string[];
  uses_facility: string[];
  json: SourceRecipeJson;
  output: string[];
  uses_recipe?: string[];
}

export interface SourceRecipeJson {
  facility: string;
  materials: SourceMaterial[];
  skills: SourceSkill[];
  outputs: string[];
  output: SourceOutput;
  recipe?: string;
}

export interface SourceMaterial {
  quantity: string | number;
  name: string;
  link: string;
  qty: string | number;
  item: string;
  image: string;
}

export interface SourceSkill {
  name: string;
  experience: string;
}

export interface SourceOutput {
  quantity: string | number;
  name: string;
  link: string;
  qty: string | number;
  item: string;
  image: string;
}
