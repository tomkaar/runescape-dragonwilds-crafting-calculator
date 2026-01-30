import { FacilityType } from "@/data/facilityTypes";
import { type Node } from "@xyflow/react";

export type RootNode = Node<{
  name: string;
  id: string;
  image: string | undefined;
  quantity: number;
  numberOfRecipes: number;
  hasTarget: boolean;
}> & { type: "root" };

export type OptionVariantNode = Node<{
  facility: FacilityType | undefined;
  optionNumber: number;
}> & {
  type: "option-variant";
};

export type FacilityNode = Node<{
  facility: FacilityType | undefined;
}> & {
  type: "facility";
};

export type MaterialNode = Node<{
  name: string;
  quantity: number;
  image: string | undefined;
}> & {
  type: "material";
};

export type Nodes = RootNode | OptionVariantNode | FacilityNode | MaterialNode;
