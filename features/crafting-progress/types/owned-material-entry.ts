/** A single material aggregated across all tracked items, with its total needed quantity. */
export type OwnedMaterialEntry = {
  itemId: string;
  name: string;
  wikiLink?: string;
  image: string | null;
  /** Total quantity needed across every tracked item that requires this material. */
  needed: number;
  /** All (trackedItemId, nodeId) pairs that contributed to this entry's needed count. */
  nodeRefs: { trackedItemId: string; nodeId: string }[];
};
