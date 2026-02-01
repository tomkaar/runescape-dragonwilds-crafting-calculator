import { Facility } from "@/Types";
import { Node } from "@xyflow/react";

export type RootNode = Node<{
  name: string;
  label: string;
  id: string;
  image: string | null;
  quantity: number;
  numberOfRecipes: number;
  facility: (typeof Facility)[number] | null;
  /**
   * If this node is the starting node of the crafting tree.
   * Only display the top handle if true.
   */
  start?: boolean;
}> & {
  type: "root";
};

export type MaterialNode = Node<{
  id: string;
  name: string;
  image: string | null;
  label: string;
  quantity: number;
  facility: (typeof Facility)[number] | null;
  /**
   * If this node is the end node of the crafting tree.
   */
  end?: boolean;
}> & {
  type: "material";
};

export type RecipeVariantNode = Node<{
  id: string;
  optionNumber: number;
  name: string;
  label: string;
  facility: (typeof Facility)[number] | null;
}> & {
  type: "recipeVariant";
};

export type Nodes = RootNode | MaterialNode | RecipeVariantNode;
