import { describe, expect, it, vi } from "vitest";
import { useNextStepsOptions } from "./next-steps-options";

// The store persists to localStorage, which the node test environment lacks.
vi.hoisted(() => {
	const storage = new Map<string, string>();
	globalThis.localStorage = {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => storage.set(key, value),
		removeItem: (key: string) => storage.delete(key),
	} as unknown as Storage;
});

describe("useNextStepsOptions.showNeeded", () => {
	it("defaults to shown", () => {
		expect(useNextStepsOptions.getState().showNeeded).toBe(true);
	});

	it("flips when toggled", () => {
		useNextStepsOptions.getState().toggleShowNeeded();
		expect(useNextStepsOptions.getState().showNeeded).toBe(false);

		useNextStepsOptions.getState().toggleShowNeeded();
		expect(useNextStepsOptions.getState().showNeeded).toBe(true);
	});
});
