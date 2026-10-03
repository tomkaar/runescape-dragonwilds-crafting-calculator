import { describe, expect, it, vi } from "vitest";
import type { Item, Store } from "@/Types";
import { makeItem } from "@/test/crafting-helpers";

vi.mock("@/data/items.json", () => ({ default: [] }));

async function loadGetMerchantTrades(items: Item[]) {
	vi.resetModules();
	vi.doMock("@/data/items.json", () => ({ default: items }));
	return (await import("./get-merchant-trades")).getMerchantTrades;
}

function makeTradedItem(
	id: string,
	stores: { sold_by?: Store[]; bought_by?: Store[] },
): Item {
	return { ...makeItem(id, [], id), ...stores };
}

const store = (name: string, cost: number, currency = "Garou Chit") => ({
	name,
	currency,
	cost,
});

describe("an item that is not used as currency", () => {
	it("returns no trades", async () => {
		const items = [makeTradedItem("bar", { sold_by: [store("Domri", 5)] })];
		const getMerchantTrades = await loadGetMerchantTrades(items);
		expect(getMerchantTrades("bar")).toEqual({ buy: [], sell: [] });
	});
});

describe("items traded for a currency", () => {
	it("puts sold_by under buy and bought_by under sell", async () => {
		const items = [
			makeTradedItem("bar", {
				sold_by: [store("Domri", 5)],
				bought_by: [store("Beartach", 60)],
			}),
		];
		const getMerchantTrades = await loadGetMerchantTrades(items);
		expect(getMerchantTrades("garou-chit")).toEqual({
			buy: [
				{
					merchant: "Domri",
					items: [{ id: "bar", name: "bar", image: null, cost: 5 }],
				},
			],
			sell: [
				{
					merchant: "Beartach",
					items: [{ id: "bar", name: "bar", image: null, cost: 60 }],
				},
			],
		});
	});

	it("sorts merchants and their items alphabetically", async () => {
		const items = [
			makeTradedItem("zinc", { sold_by: [store("Domri", 1)] }),
			makeTradedItem("axe", { sold_by: [store("Domri", 2)] }),
			makeTradedItem("bow", { sold_by: [store("Beartach", 3)] }),
		];
		const getMerchantTrades = await loadGetMerchantTrades(items);
		const { buy } = getMerchantTrades("garou-chit");
		expect(buy.map((g) => g.merchant)).toEqual(["Beartach", "Domri"]);
		expect(buy[1].items.map((i) => i.id)).toEqual(["axe", "zinc"]);
	});

	it("keeps currencies separate", async () => {
		const items = [
			makeTradedItem("bar", {
				sold_by: [store("Domri", 5), store("Death", 2, "Soul Fragment")],
			}),
		];
		const getMerchantTrades = await loadGetMerchantTrades(items);
		expect(
			getMerchantTrades("soul-fragment").buy.map((g) => g.merchant),
		).toEqual(["Death"]);
		expect(getMerchantTrades("garou-chit").buy.map((g) => g.merchant)).toEqual([
			"Domri",
		]);
	});
});
