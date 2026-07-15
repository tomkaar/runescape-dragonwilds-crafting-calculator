const BASE_URL = "https://dragonwilds.runescape.wiki/api.php";

interface BuildBucketQueryUrlParams {
	bucketName: string;
	fields: string[];
	limit: number;
	offset: number;
}

export function buildBucketQueryUrl({
	bucketName,
	fields,
	limit,
	offset,
}: BuildBucketQueryUrlParams): string {
	const select = fields.map((field) => `'${field}'`).join(",");
	const query = `bucket('${bucketName}').select(${select}).limit(${limit}).offset(${offset}).run()`;

	const params = new URLSearchParams({
		action: "bucket",
		format: "json",
		query,
	});

	return `${BASE_URL}?${params.toString()}`;
}
