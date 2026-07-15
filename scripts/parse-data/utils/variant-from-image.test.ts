import { describe, expect, it } from "vitest";
import variantFromImage from "./variant-from-image";

describe("variantFromImage", () => {
	it("extracts the variant name from parenthesized image markup", () => {
		expect(variantFromImage("[[File:Wall (Cabin).png|30px|link=Wall]]")).toBe(
			"Cabin",
		);
	});

	it("returns null when the image has no parenthesized variant", () => {
		expect(variantFromImage("[[File:Wall.png|30px|link=Wall]]")).toBeNull();
	});

	it("returns null when no image is given", () => {
		expect(variantFromImage(undefined)).toBeNull();
	});

	it("returns null for an empty string", () => {
		expect(variantFromImage("")).toBeNull();
	});
});
