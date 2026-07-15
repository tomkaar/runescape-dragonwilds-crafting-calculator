import { buildBucketQueryUrl } from "./build-bucket-query-url";

export const PAGE_SIZE = 500;

interface RawBucketEntry {
	json?: string;
	[key: string]: unknown;
}

export async function fetchAllBucketData<T>(
	bucketName: string,
	fields: string[],
): Promise<T[]> {
	let offset = 0;
	let allData: T[] = [];
	let hasMore = true;

	while (hasMore) {
		const url = buildBucketQueryUrl({
			bucketName,
			fields,
			limit: PAGE_SIZE,
			offset,
		});

		console.log(`Fetching ${bucketName} with offset ${offset}...`);

		const response = await fetch(url);
		const data = await response.json();

		if (data.error) {
			throw new Error(`Bucket query for "${bucketName}" failed: ${data.error}`);
		}

		const items = (data.bucket as RawBucketEntry[]).map((entry) => ({
			...entry,
			json: entry.json ? JSON.parse(entry.json) : undefined,
		})) as T[];

		allData = [...allData, ...items];

		if (items.length === PAGE_SIZE) {
			offset += PAGE_SIZE;
		} else {
			hasMore = false;
		}
	}

	console.log(`Total ${bucketName} fetched: ${allData.length}`);
	return allData;
}
