"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { forwardRef } from "react";
import { Facilities } from "@/features/crafting-tree/components/nodes/facilities";
import { NodeDropdownMenu } from "@/features/crafting-tree/components/nodes/node-dropdown-menu";
import { NodeOverlayTags } from "@/features/crafting-tree/components/nodes/node-overlay-tags";
import { NodeToggleButton } from "@/features/crafting-tree/components/nodes/node-toggle-button";
import { useCraftingTreeHover } from "@/features/crafting-tree/context/crafting-tree-hover";
import type { MaterialNode as MaterialNodeType } from "@/features/crafting-tree/schemas/Node";
import { cn } from "@/lib/utils";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";

const MaterialNode = forwardRef<HTMLDivElement, NodeProps<MaterialNodeType>>(
	function InnerMaterialNode(props, ref) {
		const { enter, reset, check, isSet } = useCraftingTreeHover();
		const direction = useCraftingTreeDirection((state) => state.direction);

		const isHovered = check(props.id);
		const { data } = props;
		const isVariantOption = data.isRecipeNumberVariant !== null;

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: <known issue>
			<div
				ref={ref}
				className={cn(
					"flex flex-col items-center justify-center bg-card hover:bg-secondary border border-border rounded-lg",
					isVariantOption && "border border-dashed border-title",
					isSet && !isHovered && "opacity-25",
				)}
				onMouseEnter={() => enter(props.id)}
				onMouseLeave={() => reset()}
			>
				<div className="relative flex flex-row items-center">
					<NodeOverlayTags
						isRecipeNumberVariant={data.isRecipeNumberVariant}
						hasExcessItems={data.hasExcessItems}
						quantity={data.quantityNeeded}
						quantityRecieved={data.quantityRecieved}
					/>
					<NodeToggleButton
						id={data.id}
						nodeId={props.id}
						initialItemId={data.initialItemId}
						image={data.image}
						label={data.label}
						quantity={data.quantityNeeded}
						disabled={isVariantOption}
					/>
					{!isVariantOption && (
						<div className="ml-2 mr-1">
							<NodeDropdownMenu
								id={data.id}
								nodeId={props.id}
								initialItemId={data.initialItemId}
								quantity={data.quantityNeeded}
							/>
						</div>
					)}
				</div>

				<Facilities facilities={data.facilities} />

				{!data.isRoot && (
					<Handle
						type="target"
						position={direction === "LR" ? Position.Left : Position.Top}
						draggable={false}
						isConnectable={false}
					/>
				)}
				{!data.leafNode && (
					<Handle
						type="source"
						position={direction === "LR" ? Position.Right : Position.Bottom}
						draggable={false}
						isConnectable={false}
					/>
				)}
			</div>
		);
	},
);

MaterialNode.displayName = "MaterialNode";

export default MaterialNode;
