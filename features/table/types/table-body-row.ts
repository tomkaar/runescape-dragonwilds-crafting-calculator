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

	materialsCount: number;
	materials: {
		itemId: string;
		name: string;
		image: string | null;
		quantity: number;
	}[];

	wikiLink?: string;
};
