"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";

import { type Node } from "@/features/crafting-tree/schemas/Node";
import { forwardRef, memo } from "react";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useCraftingTreeHover } from "@/context/crafting-tree-hover";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";
import { NodeDropdownMenu } from "@/features/crafting-tree/components/nodes/node-dropdown-menu";
import { Facilities } from "@/features/crafting-tree/components/nodes/facilities";
import { RecipeNumberTooltip } from "@/features/crafting-tree/components/nodes/recipe-number-tooltip";
import { ExcessItemsTooltip } from "@/features/crafting-tree/components/nodes/excess-items-tooltip";

const DefaultlNode = forwardRef<HTMLDivElement, NodeProps<Node>>(
  function InnerMaterialNode(props, ref) {
    const { enter, reset, check, isSet } = useCraftingTreeHover();
    const direction = useCraftingTreeDirection((state) => state.direction);

    const isHovered = check(props.id);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center bg-card hover:bg-secondary border border-border rounded-lg",
          props.data.numberOfRecipies &&
            props.data.numberOfRecipies > 1 &&
            "border border-dashed border-title",
          props.data.isRecipeNumberVariant !== null &&
            "border border-dashed border-title",
          isSet && !isHovered && "opacity-25",
        )}
        onMouseEnter={() => enter(props.id)}
        onMouseLeave={() => reset()}
      >
        <Content
          id={props.data.id}
          nodeId={props.id}
          initialItemId={props.data.initialItemId}
          image={props.data.image}
          label={props.data.label}
          facilities={props.data.facilities}
          quantity={props.data.quantityNeeded}
          quantityRecieved={props.data.quantityRecieved}
          numberOfRecipies={props.data.numberOfRecipies}
          isRecipeNumberVariant={props.data.isRecipeNumberVariant}
          hasExcessItems={props.data.hasExcessItems}
        />
        {!props.data.initialNode && (
          <Handle
            type="target"
            position={direction === "LR" ? Position.Left : Position.Top}
            draggable={false}
            isConnectable={false}
          />
        )}
        {!props.data.leafNode && (
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

type ContentProps = {
  id: string;
  nodeId: string;
  initialItemId: string;
  image: string | null;
  label: string;
  quantity: number;
  quantityRecieved: number;
  numberOfRecipies: number | null;
  isRecipeNumberVariant: number | null;
  facilities: string[];
  hasExcessItems: boolean;
};

const Content = memo(function InnerContent(props: ContentProps) {
  const {
    id,
    nodeId,
    initialItemId,
    image,
    label,
    facilities,
    quantity,
    quantityRecieved,
    numberOfRecipies,
    isRecipeNumberVariant,
    hasExcessItems,
  } = props;
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.find((item) => item.nodeId === nodeId);
  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const handleToggleItem = () => {
    if (added) {
      removeAnItemByNodeId(initialItemId, nodeId);
      return;
    }
    addAnItem(initialItemId, {
      id: self.crypto.randomUUID(),
      itemId: id,
      quantity,
      nodeId,
      nodeOriginalId: initialItemId,
      state: "TODO",
    });
  };

  return (
    <>
      <div className="relative flex flex-row items-center">
        {isRecipeNumberVariant !== null || hasExcessItems ? (
          <div className="absolute z-10 flex flex-row gap-1 -top-3 left-1/2 -translate-x-1/2">
            {isRecipeNumberVariant !== null && (
              <RecipeNumberTooltip isRecipeNumberVariant={isRecipeNumberVariant} />
            )}
            {hasExcessItems && (
              <ExcessItemsTooltip quantityRecieved={quantityRecieved} quantity={quantity} />
            )}
          </div>
        ) : null}
        <button
          onClick={handleToggleItem}
          className={cn(
            "flex flex-row gap-1 items-center pl-1 py-1",
            isRecipeNumberVariant !== null && "pr-2",
          )}
          disabled={isRecipeNumberVariant !== null}
        >
          {image && (
            <img
              src={createImageUrlPath(image)}
              alt={label}
              width={24}
              height={24}
            />
          )}
          <div className="text-xs text-foreground">
            <span className="font-semibold">{quantity}x</span> {label}
          </div>
        </button>
        {isRecipeNumberVariant === null && (
          <div className="ml-2 mr-1">
            <NodeDropdownMenu
              id={id}
              nodeId={nodeId}
              initialItemId={initialItemId}
              quantity={quantity}
            />
          </div>
        )}
      </div>

      {numberOfRecipies && numberOfRecipies > 1 && (
        <div className="relative w-[calc(100%+2px)] -mb-px flex flex-row items-center justify-center text-xs text-black bg-title px-2 py-1 rounded-b-lg">
          {numberOfRecipies} recipes
        </div>
      )}

      <Facilities facilities={facilities} />
    </>
  );
});

DefaultlNode.displayName = "DefaultlNode";

export default DefaultlNode;
