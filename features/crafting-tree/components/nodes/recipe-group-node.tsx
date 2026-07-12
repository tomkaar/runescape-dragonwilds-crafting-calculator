"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { forwardRef } from "react";

import { type RecipeGroupNode as RecipeGroupNodeType } from "@/features/crafting-tree/schemas/Node";
import { cn } from "@/lib/utils";
import { useCraftingTreeHover } from "@/context/crafting-tree-hover";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";
import { NodeDropdownMenu } from "@/features/crafting-tree/components/nodes/node-dropdown-menu";
import { NodeToggleButton } from "@/features/crafting-tree/components/nodes/node-toggle-button";
import { RecipeCountBadge } from "@/features/crafting-tree/components/nodes/recipe-count-badge";

const RecipeGroupNode = forwardRef<HTMLDivElement, NodeProps<RecipeGroupNodeType>>(
  function InnerRecipeGroupNode(props, ref) {
    const { enter, reset, check, isSet } = useCraftingTreeHover();
    const direction = useCraftingTreeDirection((state) => state.direction);

    const isHovered = check(props.id);
    const { data } = props;

    return (
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
        />
      </div>
    );
  },
);

RecipeGroupNode.displayName = "RecipeGroupNode";

export default RecipeGroupNode;
