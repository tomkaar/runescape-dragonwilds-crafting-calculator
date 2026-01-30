import { getRecipeById } from "../getRecipeById";
import { createNodeGroup } from "./createNodeGroup";
import { Nodes } from "./type";

export function resolveRecipeTree(itemName: string) {
  const recipe = getRecipeById(itemName);

  if (!recipe) {
    return { nodes: [], edges: [] };
  }

  const nodes: Nodes[] = [];
  const edges = [];

  const nodeGroup = createNodeGroup(recipe);
  if (nodeGroup) {
    nodes.push(...nodeGroup.nodes);
    edges.push(...nodeGroup.edges);
  }

  return {
    nodes,
    edges,
  };
}
