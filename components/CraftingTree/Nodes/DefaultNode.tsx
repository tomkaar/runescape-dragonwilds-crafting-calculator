"use client";

import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

import { type Node } from "@/components/CraftingTree/nodes";
import { createImageUrlPath } from "@/scripts/utils/createImageUrl";
import { forwardRef, memo } from "react";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { PlusSquareIcon, XSquareIcon } from "lucide-react";
import { Facility } from "@/Types";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";

type Props = Node;

const DefaultlNode = forwardRef<HTMLDivElement, Props>(
  function InnerMaterialNode(props, ref) {
    const i = useSelectedMaterial((state) => state.items);
    const items = i[props.data.initialItemId] || [];
    const added = items.some((item) => item.nodeId === props.id);

    const recipesArray = Array.from({
      length: props.data.numberOfRecipies || 0,
    });
    const startsWith = items
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
          added ? "bg-green-900/50 hover:bg-green-900" : "",
          props.data.numberOfRecipies &&
            props.data.numberOfRecipies > 1 &&
            "border border-dashed border-yellow-400",
          props.data.hasExcessItems ? "border border-sky-400" : "",
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
          initialNode={props.data.initialNode}
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
  facility: string | null;
  initialNode: boolean | null;
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
    initialNode,
    hasExcessItems,
  } = props;
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.some((item) => item.nodeId === nodeId);
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
    });
  };

  return (
    <>
      <button
        onClick={handleToggleItem}
        disabled={initialNode || false}
        className="cursor-pointer flex flex-row gap-1 items-center justify-center pl-1 pr-2 py-1"
      >
        {image && (
          <Image
            src={createImageUrlPath(image)}
            alt={label}
            width={24}
            height={24}
          />
        )}
        <div className="text-xs text-white">
          <span className="font-semibold">{quantity}x</span> {label}
        </div>

        {!initialNode && (
          <div
            className={cn(
              "ml-1",
              "text-emerald-700 cursor-pointer hover:text-emerald-500",
              added ? "text-white hover:text-white" : "",
            )}
          >
            {added ? <XSquareIcon width={16} /> : <PlusSquareIcon width={16} />}
          </div>
        )}
      </button>

      {hasExcessItems && (
        <div className="w-full flex flex-row items-center justify-center text-xs text-sky-400 px-2 pb-1 rounded-lg">
          {quantityRecieved - quantity} extra item
          {quantityRecieved - quantity !== 1 ? "s" : ""} after fulfilling
          requirement
        </div>
      )}

      {numberOfRecipies && numberOfRecipies > 1 && (
        <div className="w-full flex flex-row items-center justify-center text-xs text-yellow-400 bg-neutral-900 px-2 py-1 rounded-lg">
          {numberOfRecipies} recipes
        </div>
      )}

      {facility && (
        <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-neutral-900 px-2 py-1 rounded-lg">
          {getFacilityIcon(facility as (typeof Facility)[number])}
          {facility}
        </div>
      )}
    </>
  );
});

DefaultlNode.displayName = "DefaultlNode";

export default DefaultlNode;
