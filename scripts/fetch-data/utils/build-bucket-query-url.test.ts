import { describe, expect, it } from "vitest";
import { buildBucketQueryUrl } from "./build-bucket-query-url";

describe("buildBucketQueryUrl", () => {
	it("targets the bucket API action in JSON format", () => {
		const url = buildBucketQueryUrl({
			bucketName: "recipe",
			fields: ["output"],
			limit: 500,
			offset: 0,
		});
		const parsed = new URL(url);

		expect(parsed.origin + parsed.pathname).toBe(
			"https://dragonwilds.runescape.wiki/api.php",
		);
		expect(parsed.searchParams.get("action")).toBe("bucket");
		expect(parsed.searchParams.get("format")).toBe("json");
	});

	it("quotes the bucket name and each field in the query DSL", () => {
		const url = buildBucketQueryUrl({
			bucketName: "recipe",
			fields: ["output", "json"],
			limit: 500,
			offset: 0,
		});
		const query = new URL(url).searchParams.get("query");

		expect(query).toBe(
			"bucket('recipe').select('output','json').limit(500).offset(0).run()",
		);
	});

	it("reflects limit and offset in the query", () => {
		const url = buildBucketQueryUrl({
			bucketName: "infobox_item",
			fields: ["item_name"],
			limit: 250,
			offset: 750,
		});
		const query = new URL(url).searchParams.get("query");

		expect(query).toBe(
			"bucket('infobox_item').select('item_name').limit(250).offset(750).run()",
		);
	});
});
