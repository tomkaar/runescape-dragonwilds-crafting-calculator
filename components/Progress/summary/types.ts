// Matches the local Item shape in the selected-material store.
export type MarkedMaterial = {
  id: string;
  itemId: string;
  quantity: number;
  nodeId?: string;
  state: "TODO" | "DONE";
};
