import { describe, expect, it, vi } from "vitest";
import type { Recipe } from "@/Types";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
	sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { resolveFacilityRequirements } from "./resolve-facility-requirements";

const mockSourceItemById = vi.mocked(sourceItemById);

function facility(name: string) {
	return name as Recipe["facilities"][number];
}

describe("resolveFacilityRequirements", () => {
	it("returns the item's own facilities and no additional facilities when it has no ingredients", () => {
		const item = makeItem("leaf-item", [makeVariant(null)]);
		item.facilities = [facility("Workbench")];
		mockSourceItemById.mockReturnValue(item);

		const result = resolveFacilityRequirements(item, "leaf-item");

		expect(result.ownFacilities).toEqual(["Workbench"]);
		expect(result.additionalFacilities).toEqual([]);
	});

	it("filters out null entries and deduplicates the item's own facilities", () => {
		const item = makeItem("leaf-item", [makeVariant(null)]);
		item.facilities = [null, facility("Workbench"), facility("Workbench")];
		mockSourceItemById.mockReturnValue(item);

		const result = resolveFacilityRequirements(item, "leaf-item");

		expect(result.ownFacilities).toEqual(["Workbench"]);
	});

	it("puts facilities only required by an ingredient into additionalFacilities", () => {
		const mat = makeItem("mat-item", [
			makeVariant(makeRecipe(1, [], [facility("Forge")])),
		]);
		const item = makeItem("parent-item", [
			makeVariant(
				makeRecipe(
					1,
					[{ itemId: "mat-item", quantity: 1 }],
					[facility("Workbench")],
				),
			),
		]);
		item.facilities = [facility("Workbench")];
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-item") return item;
			if (id === "mat-item") return mat;
			return undefined;
		});

		const result = resolveFacilityRequirements(item, "parent-item");

		expect(result.ownFacilities).toEqual(["Workbench"]);
		expect(result.additionalFacilities).toEqual(["Forge"]);
	});

	it("does not duplicate a facility in additionalFacilities when it is already an own facility", () => {
		const mat = makeItem("mat-item", [
			makeVariant(makeRecipe(1, [], [facility("Workbench")])),
		]);
		const item = makeItem("parent-item", [
			makeVariant(
				makeRecipe(
					1,
					[{ itemId: "mat-item", quantity: 1 }],
					[facility("Workbench")],
				),
			),
		]);
		item.facilities = [facility("Workbench")];
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-item") return item;
			if (id === "mat-item") return mat;
			return undefined;
		});

		const result = resolveFacilityRequirements(item, "parent-item");

		expect(result.additionalFacilities).toEqual([]);
	});

	it("collects additional facilities from deeply nested ingredients", () => {
		const grandchild = makeItem("grandchild-item", [
			makeVariant(makeRecipe(1, [], [facility("Kiln")])),
		]);
		const child = makeItem("child-item", [
			makeVariant(
				makeRecipe(
					1,
					[{ itemId: "grandchild-item", quantity: 1 }],
					[facility("Furnace")],
				),
			),
		]);
		const item = makeItem("parent-item", [
			makeVariant(
				makeRecipe(
					1,
					[{ itemId: "child-item", quantity: 1 }],
					[facility("Workbench")],
				),
			),
		]);
		item.facilities = [facility("Workbench")];
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-item") return item;
			if (id === "child-item") return child;
			if (id === "grandchild-item") return grandchild;
			return undefined;
		});

		const result = resolveFacilityRequirements(item, "parent-item");

		expect(result.ownFacilities).toEqual(["Workbench"]);
		expect(result.additionalFacilities).toEqual(["Furnace", "Kiln"]);
	});
});
