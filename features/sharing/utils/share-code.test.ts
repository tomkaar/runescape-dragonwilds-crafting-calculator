import { compressToEncodedURIComponent } from "lz-string";
import { describe, expect, it } from "vitest";
import { decodeShareCode, encodeShareCode, type ShareData } from "./share-code";

function toCode(value: unknown) {
	const json = typeof value === "string" ? value : JSON.stringify(value);
	return compressToEncodedURIComponent(json);
}

const shareData: ShareData = {
	version: 1,
	selectedMaterials: {
		root: [
			{
				id: "m1",
				itemId: "leaf",
				quantity: 5,
				nodeId: "root_leaf",
				nodeOriginalId: "leaf",
				state: "TODO",
			},
			{
				id: "m2",
				itemId: "branch",
				quantity: 2,
				state: "DONE",
			},
		],
		empty: [],
	},
	materialMultipliers: { root: 3, other: 1 },
};

describe("encodeShareCode / decodeShareCode", () => {
	it("round-trips share data", () => {
		const result = decodeShareCode(encodeShareCode(shareData));

		expect(result).toEqual({ success: true, data: shareData });
	});

	it("round-trips empty stores", () => {
		const empty: ShareData = {
			version: 1,
			selectedMaterials: {},
			materialMultipliers: {},
		};

		expect(decodeShareCode(encodeShareCode(empty))).toEqual({
			success: true,
			data: empty,
		});
	});

	it("round-trips non-Latin1 characters", () => {
		const unicode: ShareData = {
			version: 1,
			selectedMaterials: {
				"30°-hip-roof": [
					{ id: "m1", itemId: "ash-logs 🌲", quantity: 6, state: "TODO" },
				],
			},
			materialMultipliers: { "30°-hip-roof": 2 },
		};

		expect(decodeShareCode(encodeShareCode(unicode))).toEqual({
			success: true,
			data: unicode,
		});
	});

	it("encodes to a URI-safe string", () => {
		expect(encodeShareCode(shareData)).toMatch(/^[A-Za-z0-9+$-]+$/);
	});

	it("encodes to a shorter string than the raw JSON", () => {
		expect(encodeShareCode(shareData).length).toBeLessThan(
			JSON.stringify(shareData).length,
		);
	});
});

describe("decodeShareCode", () => {
	it("ignores surrounding whitespace", () => {
		const code = `\n  ${encodeShareCode(shareData)}  \n`;

		expect(decodeShareCode(code)).toEqual({ success: true, data: shareData });
	});

	it("rejects an empty string", () => {
		expect(decodeShareCode("   ")).toEqual({
			success: false,
			error: "Not a valid share code",
		});
	});

	it("rejects text that isn't a compressed code", () => {
		expect(decodeShareCode("this is not a share code!")).toEqual({
			success: false,
			error: "Not a valid share code",
		});
	});

	it("rejects a code that isn't JSON", () => {
		expect(decodeShareCode(toCode("not json"))).toEqual({
			success: false,
			error: "Not a valid share code",
		});
	});

	it("rejects an unsupported version", () => {
		expect(decodeShareCode(toCode({ ...shareData, version: 2 }))).toEqual({
			success: false,
			error: "Unsupported share code version",
		});
	});

	it("rejects a payload without a version", () => {
		const { version: _, ...withoutVersion } = shareData;

		expect(decodeShareCode(toCode(withoutVersion))).toEqual({
			success: false,
			error: "Unsupported share code version",
		});
	});

	it("rejects JSON that isn't an object", () => {
		expect(decodeShareCode(toCode([1, 2, 3]))).toEqual({
			success: false,
			error: "Unsupported share code version",
		});
	});

	it("rejects a missing store", () => {
		expect(
			decodeShareCode(toCode({ version: 1, selectedMaterials: {} })),
		).toEqual({
			success: false,
			error: "Share code contains invalid data",
		});
	});

	it("rejects an invalid material state", () => {
		const invalid = {
			...shareData,
			selectedMaterials: {
				root: [{ id: "m1", itemId: "leaf", quantity: 5, state: "SKIPPED" }],
			},
		};

		expect(decodeShareCode(toCode(invalid))).toEqual({
			success: false,
			error: "Share code contains invalid data",
		});
	});

	it("rejects a negative quantity", () => {
		const invalid = {
			...shareData,
			selectedMaterials: {
				root: [{ id: "m1", itemId: "leaf", quantity: -1, state: "TODO" }],
			},
		};

		expect(decodeShareCode(toCode(invalid))).toEqual({
			success: false,
			error: "Share code contains invalid data",
		});
	});

	it("rejects a non-positive multiplier", () => {
		const invalid = { ...shareData, materialMultipliers: { root: 0 } };

		expect(decodeShareCode(toCode(invalid))).toEqual({
			success: false,
			error: "Share code contains invalid data",
		});
	});

	it("rejects a non-numeric multiplier", () => {
		const invalid = { ...shareData, materialMultipliers: { root: "3" } };

		expect(decodeShareCode(toCode(invalid))).toEqual({
			success: false,
			error: "Share code contains invalid data",
		});
	});

	it("strips unknown fields", () => {
		const withExtras = {
			...shareData,
			extra: true,
			selectedMaterials: {
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 5,
						state: "TODO",
						unknown: "field",
					},
				],
			},
		};

		expect(decodeShareCode(toCode(withExtras))).toEqual({
			success: true,
			data: {
				version: 1,
				selectedMaterials: {
					root: [{ id: "m1", itemId: "leaf", quantity: 5, state: "TODO" }],
				},
				materialMultipliers: shareData.materialMultipliers,
			},
		});
	});
});
