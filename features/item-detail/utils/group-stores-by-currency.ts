import type { Store } from "@/Types";

export type StoreCurrencyGroup = {
	currency: string;
	min: number;
	max: number;
	stores: Store[];
};

/**
 * Groups stores by currency, in order of first appearance, with the cost range of each group.
 */
export function groupStoresByCurrency(stores: Store[]): StoreCurrencyGroup[] {
	const groups = new Map<string, StoreCurrencyGroup>();

	for (const store of stores) {
		const group = groups.get(store.currency);
		if (!group) {
			groups.set(store.currency, {
				currency: store.currency,
				min: store.cost,
				max: store.cost,
				stores: [store],
			});
			continue;
		}

		group.min = Math.min(group.min, store.cost);
		group.max = Math.max(group.max, store.cost);
		group.stores.push(store);
	}

	return Array.from(groups.values());
}
