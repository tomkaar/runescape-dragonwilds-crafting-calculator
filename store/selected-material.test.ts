import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type SelectedMaterial,
	useSelectedMaterial,
} from "./selected-material";

// The store persists to localStorage, which the node test environment lacks.
vi.hoisted(() => {
	const storage = new Map<string, string>();
	globalThis.localStorage = {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => storage.set(key, value),
		removeItem: (key: string) => storage.delete(key),
	} as unknown as Storage;
});

const material: SelectedMaterial = {
	id: "m1",
	itemId: "stone",
	quantity: 2,
	nodeId: "n1",
	state: "TODO",
};

describe("useSelectedMaterial.trackItem", () => {
	beforeEach(() => {
		useSelectedMaterial.setState({ items: {} });
	});

	it("adds the item with no selected materials", () => {
		useSelectedMaterial.getState().trackItem("wall");

		expect(useSelectedMaterial.getState().items).toEqual({ wall: [] });
	});

	it("leaves an already tracked item untouched", () => {
		useSelectedMaterial.setState({ items: { wall: [material] } });

		useSelectedMaterial.getState().trackItem("wall");

		expect(useSelectedMaterial.getState().items).toEqual({ wall: [material] });
	});
});
