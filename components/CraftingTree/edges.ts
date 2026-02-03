import * as z from "zod";

export const edgeSchema = z.object({
  type: z.union([z.literal("edge"), z.literal("default")]),
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: z.object({
    highlighted: z.boolean().optional(),
  }),
});
export type Edge = z.infer<typeof edgeSchema>;
