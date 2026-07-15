import { describe, expect, it } from "vitest";
import { createImageUrlPath, extractImageFilename } from "./image-url";

describe("extractImageFilename", () => {
	it("extracts the filename from wiki image markup", () => {
		expect(
			extractImageFilename("[[File:Burnt Tomato.png|30px|link=Burnt Tomato]]"),
		).toBe("Burnt Tomato.png");
	});

	it("returns null for undefined input", () => {
		expect(extractImageFilename(undefined)).toBeNull();
	});

	it("returns null for an empty string", () => {
		expect(extractImageFilename("")).toBeNull();
	});

	it("returns null when the markup doesn't match the expected format", () => {
		expect(extractImageFilename("not wiki markup")).toBeNull();
	});
});

describe("createImageUrlPath", () => {
	it("builds a thumbnail URL with the default size", () => {
		expect(createImageUrlPath("Burnt Tomato.png")).toBe(
			"https://dragonwilds.runescape.wiki/images/thumb/Burnt_Tomato.png/32px-Burnt_Tomato.png",
		);
	});

	it("uses a custom size when provided", () => {
		expect(createImageUrlPath("Iron Ore.png", 64)).toBe(
			"https://dragonwilds.runescape.wiki/images/thumb/Iron_Ore.png/64px-Iron_Ore.png",
		);
	});

	it("percent-encodes parentheses in the filename", () => {
		expect(createImageUrlPath("Wall (Cabin).png")).toBe(
			"https://dragonwilds.runescape.wiki/images/thumb/Wall_%28Cabin%29.png/32px-Wall_%28Cabin%29.png",
		);
	});
});
