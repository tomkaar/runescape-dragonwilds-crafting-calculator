import * as z from "zod";

export const nodeSchema = z.object({
  type: z.literal("node"),
  id: z.string(),
  data: z.object({
    id: z.string(),
    label: z.string(),
    image: z.string().nullable(),
    facility: z.string().nullable(),
    numberOfRecipies: z
      .number()
      .nullable()
      .describe("The number of recipies for this item"),
    isRecipeNumberVariant: z
      .number()
      .nullable()
      .describe("Indicates if this node represents a specific recipe variant"),
    quantityNeeded: z
      .number()
      .describe("The quantity needed by the parent node"),
    quantityRecieved: z
      .number()
      .describe("The quantity of the material required"),
    hasExcessItems: z
      .boolean()
      .describe(
        "Indicates if there are excess items after fulfilling requirement for the recipe",
      ),
    initialItemId: z.string().describe("The initial item id for the tree"),
    initialNode: z
      .boolean()
      .nullable()
      .describe("Indicates if this is the starting point"),
    leafNode: z
      .boolean()
      .nullable()
      .describe("Indicates if this is last node in the branch"),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type Node = z.infer<typeof nodeSchema>;
