export type TableBodyRowType = {
	itemId: string;
	name: string;

	variantId: string;
	variant: string | null;

	itemType?: string;

	image: string | null;

	facilities: string[];
	skills: string[];

	health?: number;
	hydration?: number;
	sustenance?: number;
	outputQuantity: number;

	/* Cheapest price to buy the item from a vendor */
	buyPrice?: number;
	buyCurrency?: TableBodyRowCurrency;
	/* Highest price a vendor pays for the item */
	sellPrice?: number;
	sellCurrency?: TableBodyRowCurrency;

	materialsCount: number;
	materials: {
		itemId: string;
		name: string;
		image: string | null;
		quantity: number;
	}[];

	wikiLink?: string;
};

export type TableBodyRowCurrency = {
	name: string;
	image: string | null;
};
