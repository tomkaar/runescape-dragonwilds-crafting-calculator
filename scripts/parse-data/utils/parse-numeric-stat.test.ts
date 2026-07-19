import { describe, expect, it } from "vitest";
import { parseNumericStat } from "./parse-numeric-stat";

describe("parseNumericStat", () => {
	it("parses a plain number string", () => {
		expect(parseNumericStat("50")).toBe(50);
	});

	it("extracts the number from a qualitative label", () => {
		expect(parseNumericStat("Moderate (30)")).toBe(30);
	});

	it("returns undefined for an empty string", () => {
		expect(parseNumericStat("")).toBeUndefined();
	});

	it("returns undefined for undefined input", () => {
		expect(parseNumericStat(undefined)).toBeUndefined();
	});

	it("returns undefined for unparseable text", () => {
		expect(parseNumericStat("Unknown")).toBeUndefined();
	});
});
