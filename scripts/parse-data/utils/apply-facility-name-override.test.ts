import { describe, expect, it } from "vitest";
import { applyFacilityNameOverride } from "./apply-facility-name-override";

describe("applyFacilityNameOverride", () => {
	it("replaces a facility name that has a configured override", () => {
		expect(applyFacilityNameOverride("Anvil")).toBe("Smithing Anvil");
	});

	it("returns the original name when no override applies", () => {
		expect(applyFacilityNameOverride("Campfire")).toBe("Campfire");
	});

	it("is case-sensitive when matching overrides", () => {
		expect(applyFacilityNameOverride("anvil")).toBe("anvil");
	});
});
