// Matches the local Item shape in the selected-material store.
export type MarkedMaterial = {
  id: string;
  itemId: string;
  quantity: number;
  nodeId?: string;
  state: "TODO" | "DONE";
};

export type ParentInfo = {
  itemId: string;
  name: string;
  image: string | null;
  quantity: number;
};

export type StepCandidate = {
  nodeId: string;
  itemId: string;
  quantity: number;
  depth: number;
  parent: ParentInfo | null;
};

export type StepEntry = {
  trackedItemId: string;
  nodeId: string;
  itemId: string;
  name: string;
  image: string | null;
  quantity: number;
  state: "TODO" | "DONE";
  depth: number;
  parent: ParentInfo;
};
