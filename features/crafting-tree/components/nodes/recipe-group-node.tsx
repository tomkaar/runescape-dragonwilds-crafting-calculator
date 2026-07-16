"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { ArrowBigLeftIcon, ArrowBigUpIcon } from "lucide-react";
import { forwardRef } from "react";
import { NodeDropdownMenu } from "@/features/crafting-tree/components/nodes/node-dropdown-menu";
import { NodeToggleButton } from "@/features/crafting-tree/components/nodes/node-toggle-button";
import { RecipeCountBadge } from "@/features/crafting-tree/components/nodes/recipe-count-badge";
import { useCraftingTreeHover } from "@/features/crafting-tree/context/crafting-tree-hover";
import type { RecipeGroupNode as RecipeGroupNodeType } from "@/features/crafting-tree/schemas/Node";
import { cn } from "@/lib/utils";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";

const RecipeGroupNode = forwardRef<
	HTMLDivElement,
	NodeProps<RecipeGroupNodeType>
>(function InnerRecipeGroupNode(props, ref) {
	const { enter, reset, check, isSet } = useCraftingTreeHover();
	const direction = useCraftingTreeDirection((state) => state.direction);

	const isHovered = check(props.id);
	const { data } = props;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <known issue>
		<div
			ref={ref}
			className={cn(
				"flex flex-col items-center justify-center bg-card hover:bg-secondary border border-border rounded-lg",
				data.numberOfRecipies > 1 && "border border-dashed border-title",
				isSet && !isHovered && "opacity-25",
			)}
			onMouseEnter={() => enter(props.id)}
			onMouseLeave={() => reset()}
		>
			<div className="relative flex flex-row items-center">
				<NodeToggleButton
					id={data.id}
					nodeId={props.id}
					initialItemId={data.initialItemId}
					image={data.image}
					label={data.label}
					quantity={data.quantityNeeded}
				/>
				<div className="ml-2 mr-1">
					<NodeDropdownMenu
						id={data.id}
						nodeId={props.id}
						initialItemId={data.initialItemId}
						quantity={data.quantityNeeded}
					/>
				</div>
			</div>

			<RecipeCountBadge numberOfRecipies={data.numberOfRecipies} />

			{!data.isRoot && (
				<Handle
					type="target"
					position={direction === "LR" ? Position.Left : Position.Top}
					draggable={false}
					isConnectable={false}
				/>
			)}
			<Handle
				type="source"
				position={direction === "LR" ? Position.Right : Position.Bottom}
				draggable={false}
				isConnectable={false}
				className="handle-border relative bg-none border-none w-4 h-4"
			>
				{direction === "LR" ? (
					<ArrowBigLeftIcon
						size={16}
						color="#777"
						fill="#777"
						className="pointer-events-none relative -translate-y-1/2 -left-1.5"
					/>
				) : (
					<ArrowBigUpIcon
						size={16}
						color="#777"
						fill="#777"
						className="pointer-events-none relative w-4 h-4 -left-1.25 -top-1.25 shadow-2xl"
					/>
				)}
			</Handle>
		</div>
	);
});

RecipeGroupNode.displayName = "RecipeGroupNode";

export default RecipeGroupNode;
