import { describe, expect, it, vi } from "vitest";
import { useExperienceSummaryOptions } from "./experience-summary-options";

// The store persists to localStorage, which the node test environment lacks.
vi.hoisted(() => {
	const storage = new Map<string, string>();
	globalThis.localStorage = {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => storage.set(key, value),
		removeItem: (key: string) => storage.delete(key),
	} as unknown as Storage;
});

describe("useExperienceSummaryOptions.showOnlyGained", () => {
	it("defaults to showing all skills", () => {
		expect(useExperienceSummaryOptions.getState().showOnlyGained).toBe(false);
	});

	it("flips when toggled", () => {
		useExperienceSummaryOptions.getState().toggleShowOnlyGained();
		expect(useExperienceSummaryOptions.getState().showOnlyGained).toBe(true);

		useExperienceSummaryOptions.getState().toggleShowOnlyGained();
		expect(useExperienceSummaryOptions.getState().showOnlyGained).toBe(false);
	});
});
