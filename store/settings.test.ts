import { beforeEach, describe, expect, it, vi } from "vitest";
import { xpForLevel } from "@/domain/experience/experience-table";
import { useSettings } from "./settings";

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
