/** One item along a path through a tracked item's material tree. */
export type MaterialPathSegment = {
	itemId: string;
	name: string;
	image: string | null;
};

/** A place where a marked material is needed but hasn't been marked, identified by the path from the tracked item down to the material's parent. */
export type MissingMarking = {
	trackedItemId: string;
	path: MaterialPathSegment[];
	/** No recipe could be inferred for a multi-variant parent, so the material is missing from at least one of its recipes. */
	anyRecipe: boolean;
	/** Where the material can be marked to fill this gap — one per candidate recipe (recipeNumber is null for a single-recipe parent). */
	targets: Array<{ nodeId: string; recipeNumber: number | null }>;
};

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
	/** Places this material is needed but not marked — its total may be undercounted when non-empty (see computeMissingMarkings). */
	missingPaths: MissingMarking[];
};
