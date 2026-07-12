import { afterEach, describe, expect, it, vi } from "vitest";
import { assertUniqueIds } from "./assert-unique-ids";

describe("assertUniqueIds", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("does not warn when all ids are unique", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("item", [
			{ id: "a", name: "Item A" },
			{ id: "b", name: "Item B" },
		]);

		expect(warn).not.toHaveBeenCalled();
	});

	it("does not warn when the same id repeats under the same name", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("variant", [
			{ id: "a", name: "Item A" },
			{ id: "a", name: "Item A" },
		]);

		expect(warn).not.toHaveBeenCalled();
	});

	it("warns when two different names share an id", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("variant", [
			{ id: "moon-ring", name: "Moon Ring" },
			{ id: "moon-ring", name: "Miner Ring" },
		]);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0][0]).toContain(
			'"moon-ring" used by both "Moon Ring" and "Miner Ring"',
		);
	});

	it("includes the given label in the warning", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("facility", [
			{ id: "x", name: "One" },
			{ id: "x", name: "Two" },
		]);

		expect(warn.mock.calls[0][0]).toContain("Duplicate facility ids found");
	});

	it("reports every colliding pair, not just the first", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("item", [
			{ id: "a", name: "A1" },
			{ id: "a", name: "A2" },
			{ id: "b", name: "B1" },
			{ id: "b", name: "B2" },
		]);

		const message = warn.mock.calls[0][0];
		expect(message).toContain('"a" used by both "A1" and "A2"');
		expect(message).toContain('"b" used by both "B1" and "B2"');
	});

	it("handles an empty list without warning", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		assertUniqueIds("item", []);

		expect(warn).not.toHaveBeenCalled();
	});
});
