import { describe, expect, it } from "vitest";
import { applyVariantNameOverride } from "./apply-variant-name-override";

describe("applyVariantNameOverride", () => {
	it("replaces a variant name that has a configured override", () => {
		expect(applyVariantNameOverride("decoration")).toBe("Decoration");
	});

	it("returns the original name when no override applies", () => {
		expect(applyVariantNameOverride("Cabin")).toBe("Cabin");
	});

	it("is case-sensitive when matching overrides", () => {
		expect(applyVariantNameOverride("DECORATION")).toBe("DECORATION");
	});
});
