import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent,
} from "lz-string";
import { z } from "zod";

const SHARE_CODE_VERSION = 1;

const selectedMaterialSchema = z.object({
	id: z.string(),
	itemId: z.string(),
	quantity: z.number().nonnegative(),
	nodeId: z.string().optional(),
	nodeOriginalId: z.string().optional(),
	state: z.enum(["TODO", "DONE"]),
});

const versionSchema = z.object({ version: z.literal(SHARE_CODE_VERSION) });

const shareDataSchema = versionSchema.extend({
	selectedMaterials: z.record(z.string(), z.array(selectedMaterialSchema)),
	materialMultipliers: z.record(z.string(), z.number().positive()),
});

export type ShareData = z.infer<typeof shareDataSchema>;

type DecodeResult =
	| { success: true; data: ShareData }
	| { success: false; error: string };

export function encodeShareCode(data: ShareData): string {
	return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeShareCode(code: string): DecodeResult {
	let json: unknown;
	try {
		const decompressed = decompressFromEncodedURIComponent(code.trim());
		// Invalid input decompresses to null or an empty string rather than throwing
		if (!decompressed) throw new Error("Empty decompression");
		json = JSON.parse(decompressed);
	} catch {
		return { success: false, error: "Not a valid share code" };
	}

	if (!versionSchema.safeParse(json).success) {
		return { success: false, error: "Unsupported share code version" };
	}

	const parsed = shareDataSchema.safeParse(json);
	if (!parsed.success) {
		return { success: false, error: "Share code contains invalid data" };
	}

	return { success: true, data: parsed.data };
}
