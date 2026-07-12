import type { Edge as RFEdge } from "@xyflow/react";
import * as z from "zod";

const edgeDataSchema = z.object({
	highlighted: z.boolean().optional(),
});

export type Edge = Omit<
	RFEdge<z.infer<typeof edgeDataSchema>, "edge" | "default">,
	"data"
> & {
	data: z.infer<typeof edgeDataSchema>;
};
