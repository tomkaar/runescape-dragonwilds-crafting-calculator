import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAllBucketData, PAGE_SIZE } from "./fetch-all-bucket-data";

function jsonResponse(body: unknown): Response {
	return { json: () => Promise.resolve(body) } as Response;
}

describe("fetchAllBucketData", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns a single page without requesting further pages", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(jsonResponse({ bucket: [{ page_name: "Iron Ore" }] }));
		vi.stubGlobal("fetch", fetchMock);

		const result = await fetchAllBucketData("infobox_item", ["page_name"]);

		expect(result).toEqual([{ page_name: "Iron Ore", json: undefined }]);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("parses the json field from a JSON string into an object", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			jsonResponse({
				bucket: [{ page_name: "Iron Ore", json: '{"weight":"1"}' }],
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const [result] = await fetchAllBucketData<{
			page_name: string;
			json: { weight: string };
		}>("infobox_item", ["page_name", "json"]);

		expect(result.json).toEqual({ weight: "1" });
	});

	it("leaves json undefined when the entry has none", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(jsonResponse({ bucket: [{ page_name: "Iron Ore" }] }));
		vi.stubGlobal("fetch", fetchMock);

		const [result] = await fetchAllBucketData<{ json?: unknown }>(
			"infobox_item",
			["page_name"],
		);

		expect(result.json).toBeUndefined();
	});

	it("pages through results until a page returns fewer than the page size", async () => {
		const fullPage = Array.from({ length: PAGE_SIZE }, (_, i) => ({
			page_name: `Item ${i}`,
		}));
		const partialPage = [{ page_name: "Last Item" }];
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ bucket: fullPage }))
			.mockResolvedValueOnce(jsonResponse({ bucket: partialPage }));
		vi.stubGlobal("fetch", fetchMock);

		const result = await fetchAllBucketData("infobox_item", ["page_name"]);

		expect(result).toHaveLength(PAGE_SIZE + 1);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("throws a descriptive error when the API reports a query error", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			jsonResponse({
				error: "Field item_repair not found in bucket infobox_item.",
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		await expect(
			fetchAllBucketData("infobox_item", ["item_repair"]),
		).rejects.toThrow(
			'Bucket query for "infobox_item" failed: Field item_repair not found in bucket infobox_item.',
		);
	});

	it("stops immediately when the first page is empty", async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ bucket: [] }));
		vi.stubGlobal("fetch", fetchMock);

		const result = await fetchAllBucketData("infobox_item", ["page_name"]);

		expect(result).toEqual([]);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("requests increasing offsets across pages", async () => {
		const fullPage = Array.from({ length: PAGE_SIZE }, () => ({
			page_name: "x",
		}));
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ bucket: fullPage }))
			.mockResolvedValueOnce(jsonResponse({ bucket: [] }));
		vi.stubGlobal("fetch", fetchMock);

		await fetchAllBucketData("infobox_item", ["page_name"]);

		const firstUrl = new URL(fetchMock.mock.calls[0][0] as string);
		const secondUrl = new URL(fetchMock.mock.calls[1][0] as string);

		expect(firstUrl.searchParams.get("query")).toContain("offset(0)");
		expect(secondUrl.searchParams.get("query")).toContain(
			`offset(${PAGE_SIZE})`,
		);
	});
});
