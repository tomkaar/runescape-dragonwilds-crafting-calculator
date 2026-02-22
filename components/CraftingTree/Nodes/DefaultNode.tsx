"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";

import { type Node } from "@/components/CraftingTree/nodes";
import { forwardRef, memo } from "react";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { Facility } from "@/Types";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

const DefaultlNode = forwardRef<HTMLDivElement, NodeProps<Node>>(
  function InnerMaterialNode(props, ref) {
    const i = useSelectedMaterial((state) => state.items);
    const items = i[props.data.initialItemId] || [];
    const added = items.find((item) => item.nodeId === props.id);

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
        )}
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
            position={Position.Top}
            draggable={false}
            isConnectable={false}
          />
        )}
        {!props.data.leafNode && (
          <Handle
            type="source"
            position={Position.Bottom}
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
      <button
        onClick={handleToggleItem}
        className="relative cursor-pointer pl-1 pr-2 py-1"
        disabled={isRecipeNumberVariant !== null}
      >
        {isRecipeNumberVariant !== null && (
          <div className="absolute z-10 -top-0.5 left-1/2 -translate-1/2 whitespace-nowrap rounded-lg px-2 py-0.5 bg-title text-[8px] text-black pt-1">
            Recipe option {isRecipeNumberVariant}
          </div>
        )}
        <div className="flex flex-row gap-1 items-center">
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
        </div>

        {hasExcessItems && (
          <div className="w-full flex flex-row items-center text-xs text-sky-400 px-2 pb-1 rounded-lg">
            {quantityRecieved - quantity} extra item
            {quantityRecieved - quantity !== 1 ? "s" : ""} after fulfilling
            requirement
          </div>
        )}
      </button>

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
