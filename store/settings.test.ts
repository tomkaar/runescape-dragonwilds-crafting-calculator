import { beforeEach, describe, expect, it, vi } from "vitest";
import { xpForLevel } from "@/domain/experience/experience-table";
import {
	isSettingsEqual,
	pickSettings,
	type SettingsState,
	useSettings,
} from "./settings";

// The store persists to localStorage, which the node test environment lacks.
vi.hoisted(() => {
	const storage = new Map<string, string>();
	globalThis.localStorage = {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => storage.set(key, value),
		removeItem: (key: string) => storage.delete(key),
	} as unknown as Storage;
});

const initialState = useSettings.getState();

beforeEach(() => {
	useSettings.setState(initialState, true);
});

describe("useSettings.nextSteps.showNeeded", () => {
	it("defaults to shown", () => {
		expect(useSettings.getState().nextSteps.showNeeded).toBe(true);
	});

	it("flips when toggled", () => {
		useSettings.getState().toggleShowNeeded();
		expect(useSettings.getState().nextSteps.showNeeded).toBe(false);

		useSettings.getState().toggleShowNeeded();
		expect(useSettings.getState().nextSteps.showNeeded).toBe(true);
	});

	it("leaves the other next steps options untouched", () => {
		useSettings.getState().toggleShowNeeded();

		expect(useSettings.getState().nextSteps).toEqual({
			showCovered: false,
			showUsedFor: true,
			showNeeded: false,
		});
	});
});

describe("useSettings.experienceSummary.showOnlyGained", () => {
	it("defaults to showing all skills", () => {
		expect(useSettings.getState().experienceSummary.showOnlyGained).toBe(false);
	});

	it("flips when toggled", () => {
		useSettings.getState().toggleShowOnlyGained();
		expect(useSettings.getState().experienceSummary.showOnlyGained).toBe(true);

		useSettings.getState().toggleShowOnlyGained();
		expect(useSettings.getState().experienceSummary.showOnlyGained).toBe(false);
	});
});

describe("useSettings.skills", () => {
	it("setLevel stores the XP floor of that level", () => {
		useSettings.getState().setLevel("Artisan", 10);

		expect(useSettings.getState().skills.levels.Artisan).toEqual({
			xp: xpForLevel(10),
		});
	});

	it("setXp clamps negative XP to 0", () => {
		useSettings.getState().setXp("Artisan", -50);

		expect(useSettings.getState().skills.levels.Artisan).toEqual({ xp: 0 });
	});

	it("clearSkill removes only that skill", () => {
		useSettings.getState().setXp("Artisan", 100);
		useSettings.getState().setXp("Cooking", 200);

		useSettings.getState().clearSkill("Artisan");

		expect(useSettings.getState().skills.levels).toEqual({
			Cooking: { xp: 200 },
		});
	});
});

describe("useSettings.facilities", () => {
	it("setFacilityOwned merges with existing entries", () => {
		useSettings.getState().setFacilityOwned("Anvil", true);
		useSettings.getState().setFacilityOwned("Furnace", false);

		expect(useSettings.getState().facilities.owned).toEqual({
			Anvil: true,
			Furnace: false,
		});
	});

	it("setFacilitiesOwned sets every listed facility and leaves others untouched", () => {
		useSettings.getState().setFacilityOwned("Anvil", true);
		useSettings.getState().setFacilitiesOwned(["Furnace", "Loom"], true);

		expect(useSettings.getState().facilities.owned).toEqual({
			Anvil: true,
			Furnace: true,
			Loom: true,
		});

		useSettings.getState().setFacilitiesOwned(["Anvil", "Furnace"], false);

		expect(useSettings.getState().facilities.owned).toEqual({
			Anvil: false,
			Furnace: false,
			Loom: true,
		});
	});
});

describe("useSettings section isolation", () => {
	it("each action leaves the other sections untouched", () => {
		const { setDirection, setXp, setFacilityOwned, toggleShowCovered } =
			useSettings.getState();

		setDirection("LR");
		setXp("Artisan", 100);
		setFacilityOwned("Anvil", true);
		toggleShowCovered();

		const state = useSettings.getState();
		expect(state.craftingTree).toEqual({ direction: "LR" });
		expect(state.skills.levels).toEqual({ Artisan: { xp: 100 } });
		expect(state.facilities.owned).toEqual({ Anvil: true });
		expect(state.nextSteps).toEqual({
			showCovered: true,
			showUsedFor: true,
			showNeeded: true,
		});
		expect(state.experienceSummary).toEqual({ showOnlyGained: false });
	});
});

describe("useSettings.applySettings", () => {
	it("replaces every section with the given settings", () => {
		const next: SettingsState = {
			craftingTree: { direction: "LR" },
			experienceSummary: { showOnlyGained: true },
			nextSteps: { showCovered: true, showUsedFor: false, showNeeded: false },
			skills: { levels: { Cooking: { xp: 250 } } },
			facilities: { owned: { Furnace: true } },
		};

		useSettings.getState().applySettings(next);

		expect(pickSettings(useSettings.getState())).toEqual(next);
	});

	it("keeps the actions intact", () => {
		useSettings.getState().applySettings(pickSettings(initialState));

		useSettings.getState().toggleShowCovered();
		expect(useSettings.getState().nextSteps.showCovered).toBe(true);
	});
});

describe("isSettingsEqual", () => {
	const base = pickSettings(initialState);

	it("is true for identical settings", () => {
		expect(isSettingsEqual(base, structuredClone(base))).toBe(true);
	});

	it("detects a changed option", () => {
		expect(
			isSettingsEqual(base, {
				...base,
				nextSteps: { ...base.nextSteps, showCovered: true },
			}),
		).toBe(false);
	});

	it("detects a changed skill level", () => {
		expect(
			isSettingsEqual(base, {
				...base,
				skills: { levels: { Artisan: { xp: 10 } } },
			}),
		).toBe(false);
	});

	it("treats unchecked facilities the same as never checked", () => {
		expect(
			isSettingsEqual(base, {
				...base,
				facilities: { owned: { Furnace: false } },
			}),
		).toBe(true);
	});

	it("ignores key order of skills and facilities", () => {
		const a: SettingsState = {
			...base,
			skills: { levels: { Artisan: { xp: 1 }, Cooking: { xp: 2 } } },
			facilities: { owned: { Anvil: true, Loom: true } },
		};
		const b: SettingsState = {
			...base,
			skills: { levels: { Cooking: { xp: 2 }, Artisan: { xp: 1 } } },
			facilities: { owned: { Loom: true, Anvil: true } },
		};

		expect(isSettingsEqual(a, b)).toBe(true);
	});
});
