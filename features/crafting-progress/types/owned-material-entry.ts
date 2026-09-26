/** A single material aggregated across all tracked items, with its total and adjusted needed quantities. */
export type OwnedMaterialEntry = {
	itemId: string;
	name: string;
	wikiLink?: string;
	image: string | null;
	/** Total quantity needed across every tracked item that requires this material. */
	total: number;
	/** Quantity still needed once owned stock of its parent materials is taken into account (the material's own owned count is not subtracted). */
	adjustedValue: number;
	/** All (trackedItemId, nodeId) pairs that contributed to this entry's total. */
	nodeRefs: { trackedItemId: string; nodeId: string }[];
};
