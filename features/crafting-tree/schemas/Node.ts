import type { Node as RFNode } from "@xyflow/react";
import * as z from "zod";

const recipeGroupNodeDataSchema = z.object({
	id: z.string(),
	label: z.string(),
	image: z.string().nullable(),
	numberOfRecipies: z.number().describe("The number of recipies for this item"),
	quantityNeeded: z.number().describe("The quantity needed by the parent node"),
	initialItemId: z.string().describe("The initial item id for the tree"),
	isRoot: z
		.boolean()
		.describe("Indicates if this is the starting point of the tree"),
});

const materialNodeDataSchema = z.object({
	id: z.string(),
	label: z.string(),
	image: z.string().nullable(),
	isRecipeNumberVariant: z
		.number()
		.nullable()
		.describe("Indicates if this node represents a specific recipe variant"),
	quantityNeeded: z.number().describe("The quantity needed by the parent node"),
	quantityRecieved: z
		.number()
		.describe("The quantity of the material required"),
	hasExcessItems: z
		.boolean()
		.describe(
			"Indicates if there are excess items after fulfilling requirement for the recipe",
		),
	initialItemId: z.string().describe("The initial item id for the tree"),
	facilities: z
		.array(z.string())
		.describe("All facilities that can craft this recipe"),
	leafNode: z
		.boolean()
		.describe("Indicates if this is last node in the branch"),
	isRoot: z
		.boolean()
		.describe("Indicates if this is the starting point of the tree"),
});

export type RecipeGroupNode = RFNode<
	z.infer<typeof recipeGroupNodeDataSchema>,
	"recipe-group"
>;
export type MaterialNode = RFNode<
	z.infer<typeof materialNodeDataSchema>,
	"material"
>;

export type Node = RecipeGroupNode | MaterialNode;
