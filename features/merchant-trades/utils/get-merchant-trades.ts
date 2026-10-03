import itemsData from "@/data/items.json" with { type: "json" };
import { idFromName } from "@/scripts/parse-data/utils/id-from-name";
import type { Item, Store } from "@/Types";
import type {
	MerchantTradeGroup,
	MerchantTradeItem,
	MerchantTrades,
} from "../types/merchant-trades";

const items = itemsData as Item[];

type Direction = keyof MerchantTrades;

function addTrades(
	index: Map<string, Record<Direction, Map<string, MerchantTradeItem[]>>>,
	item: Item,
	stores: Store[] | undefined,
	direction: Direction,
) {
	for (const store of stores ?? []) {
		const currencyId = idFromName(store.currency);
		let entry = index.get(currencyId);
		if (!entry) {
			entry = { buy: new Map(), sell: new Map() };
			index.set(currencyId, entry);
		}

		const trade: MerchantTradeItem = {
			id: item.id,
			name: item.name,
			image: item.image,
			cost: store.cost,
		};
		const merchantItems = entry[direction].get(store.name);
		if (merchantItems) {
			merchantItems.push(trade);
		} else {
			entry[direction].set(store.name, [trade]);
		}
	}
}

function toSortedGroups(
	merchants: Map<string, MerchantTradeItem[]>,
): MerchantTradeGroup[] {
	return Array.from(merchants, ([merchant, items]) => ({
		merchant,
		items: items.sort((a, b) => a.name.localeCompare(b.name)),
	})).sort((a, b) => a.merchant.localeCompare(b.merchant));
}

/**
 * Maps a currency's itemId to the items merchants trade for it, grouped by merchant,
 * built once at module load so getMerchantTrades can look it up directly.
 */
function buildMerchantTradesIndex(items: Item[]): Map<string, MerchantTrades> {
	const index = new Map<
		string,
		Record<Direction, Map<string, MerchantTradeItem[]>>
	>();

	for (const item of items) {
		addTrades(index, item, item.sold_by, "buy");
		addTrades(index, item, item.bought_by, "sell");
	}

	return new Map(
		Array.from(index, ([currencyId, { buy, sell }]) => [
			currencyId,
			{ buy: toSortedGroups(buy), sell: toSortedGroups(sell) },
		]),
	);
}

const merchantTradesIndex = buildMerchantTradesIndex(items);

export function getMerchantTrades(currencyId: string): MerchantTrades {
	return merchantTradesIndex.get(currencyId) ?? { buy: [], sell: [] };
}
