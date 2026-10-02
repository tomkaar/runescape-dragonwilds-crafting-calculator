import { describe, expect, it } from "vitest";
import type { Store } from "@/Types";

import { groupStoresByCurrency } from "./group-stores-by-currency";

const domri: Store = { name: "Domri", currency: "Garou Chit", cost: 25 };
const beartach: Store = { name: "Beartach", currency: "Garou Chit", cost: 25 };
const iasadair: Store = { name: "Iasadair", currency: "Garou Chit", cost: 20 };
const death: Store = { name: "Death", currency: "Soul Fragment", cost: 200 };

describe("groupStoresByCurrency", () => {
	it("returns an empty list for no stores", () => {
		expect(groupStoresByCurrency([])).toEqual([]);
	});

	it("returns a single group for a single store", () => {
		expect(groupStoresByCurrency([domri])).toEqual([
			{ currency: "Garou Chit", min: 25, max: 25, stores: [domri] },
		]);
	});

	it("groups stores with the same currency and cost", () => {
		expect(groupStoresByCurrency([domri, beartach])).toEqual([
			{ currency: "Garou Chit", min: 25, max: 25, stores: [domri, beartach] },
		]);
	});

	it("resolves a cost range when costs differ within a currency", () => {
		expect(groupStoresByCurrency([domri, iasadair])).toEqual([
			{ currency: "Garou Chit", min: 20, max: 25, stores: [domri, iasadair] },
		]);
	});

	it("splits stores with different currencies into groups in order of appearance", () => {
		expect(groupStoresByCurrency([death, domri, beartach])).toEqual([
			{ currency: "Soul Fragment", min: 200, max: 200, stores: [death] },
			{ currency: "Garou Chit", min: 25, max: 25, stores: [domri, beartach] },
		]);
	});
});
