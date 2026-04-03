"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";

import { type Node } from "@/components/CraftingTree/nodes";
import { forwardRef, memo } from "react";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { Facility } from "@/Types";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useCraftingTreeHover } from "@/context/crafting-tree-hover";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NodeDropdownMenu } from "@/components/CraftingTree/Nodes/NodeDropdownMenu";

const DefaultlNode = forwardRef<HTMLDivElement, NodeProps<Node>>(
  function InnerMaterialNode(props, ref) {
    const i = useSelectedMaterial((state) => state.items);
    const items = i[props.data.initialItemId] || [];
    const added = items.find((item) => item.nodeId === props.id);
    const { enter, reset, check, isSet } = useCraftingTreeHover();
    const direction = useCraftingTreeDirection((state) => state.direction);

    const recipesArray = Array.from({
      length: props.data.numberOfRecipies || 0,
    });
    const startsWith = items
      .filter((i) => i.state === "DONE")
      .map((i) => i.nodeId)
      .filter((i) => i !== undefined)
      .some(
        (nodeId) =>
          props.id.startsWith(nodeId) ||
          recipesArray.some((_, index) =>
            props.id.startsWith(`${nodeId}_v${index + 1}`),
          ),
      );

    const isHovered = check(props.id);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-800 rounded-lg",
          added && added.state === "TODO"
            ? "bg-blue-900/50 hover:bg-blue-900"
            : "",
          added && added.state === "DONE"
            ? "bg-green-900/50 hover:bg-green-900"
            : "",
          props.data.numberOfRecipies &&
            props.data.numberOfRecipies > 1 &&
            "border border-dashed border-title",
          props.data.isRecipeNumberVariant !== null &&
            "border border-dashed border-title",
          startsWith && "opacity-50",
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
          facility={props.data.facility}
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
  facility: string | null;
  hasExcessItems: boolean;
};

const Content = memo(function InnerContent(props: ContentProps) {
  const {
    id,
    nodeId,
    initialItemId,
    image,
    label,
    facility,
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
  const markAsDone = useSelectedMaterial((state) => state.markAsDone);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const handleToggleItem = () => {
    if (added) {
      if (added.state === "TODO") {
        markAsDone(initialItemId, added.id);
        return;
      }
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="whitespace-nowrap rounded-lg px-2 py-0.5 bg-title text-[8px] text-black cursor-default">
                      Recipe option {isRecipeNumberVariant}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    This item has multiple ways to be crafted.
                    <br />
                    This branch shows recipe option {isRecipeNumberVariant}.
                    <br /> Only one recipe option needs to be completed.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {hasExcessItems && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="whitespace-nowrap rounded-lg px-2 py-0.5 bg-blue-600 text-[8px] text-white cursor-default">
                      {quantityRecieved - quantity} extra
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    After finishing this recipe you will <br />
                    have {quantityRecieved - quantity} extra{" "}
                    {quantityRecieved - quantity === 1 ? "item" : "items"} left
                    over.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : null}
        <button
          onClick={handleToggleItem}
          className="cursor-pointer flex flex-row gap-1 items-center pl-1 py-1"
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
          <div className="text-xs text-white">
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

      {facility && (
        <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-card px-2 py-1 rounded-lg">
          {getFacilityIcon(facility as (typeof Facility)[number])}
          {facility}
        </div>
      )}
    </>
  );
});

DefaultlNode.displayName = "DefaultlNode";

export default DefaultlNode;
