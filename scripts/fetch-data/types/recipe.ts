export interface SourceRecipe {
  uses_material?: string[];
  uses_skill?: string[];
  uses_facility: string[];
  json: SourceRecipeJson;
  output: string[];
  uses_recipe?: string[];
}

interface SourceRecipeJson {
  facility: string;
  materials: SourceMaterial[];
  skills: SourceSkill[];
  outputs: string[];
  output: SourceOutput;
  recipe?: string;
}

interface SourceMaterial {
  quantity: string | number;
  name: string;
  link: string;
  qty: string | number;
  item: string;
  image: string;
}

interface SourceSkill {
  name: string;
  experience: string;
}

interface SourceOutput {
  quantity: string | number;
  name: string;
  link: string;
  qty: string | number;
  item: string;
  image: string;
}
