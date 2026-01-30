import { FacilityType } from "./facilityTypes";
import { type RecipeMaterial } from "./getRecipe";

export interface RecipeVariant {
  id: string;
  name: string;
  variant?: string;
  facility?: FacilityType;
  materials?: RecipeMaterial[];
  skills?: RecipeSkill[];
  output: {
    quantity: number;
    name: string;
    link: string;
  };
}

export interface RecipeGroup {
  id: string;
  name: string;
  image: string | undefined;
  variant: string | undefined;
  recipes: RecipeVariant[];
}

interface GroupedRecipes {
  [itemName: string]: RecipeGroup;
}
