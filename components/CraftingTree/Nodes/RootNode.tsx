"use client";

import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import { type RootNode } from "../types";
import { createImageUrlPath } from "@/playground/items/utils/image";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { forwardRef, memo } from "react";
import { cn } from "@/lib/utils";
import { useSelectedMaterial } from "@/store/selected-material";
import { PlusSquareIcon, XSquareIcon } from "lucide-react";
import { Facility } from "@/Types";

type Props = RootNode;

const RootNode = forwardRef<HTMLDivElement, Props>(function InnerRootNode(
  props: Props,
  ref,
) {
  const i = useSelectedMaterial((state) => state.items);
  const items = i[props.data.initialItemId] || [];
  const added = items.some((item) => item.nodeId === props.id);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-800 rounded-lg",
        added ? "bg-green-900/50 hover:bg-green-900" : "",
      )}
    >
      <Content
        id={props.data.id}
        nodeId={props.id}
        initialItemId={props.data.initialItemId}
        image={props.data.image}
        name={props.data.name}
        quantity={props.data.quantity}
        numberOfRecipes={props.data.numberOfRecipes}
        facility={props.data.facility}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        draggable={false}
        isConnectable={false}
      />
      {!props.data.start && (
        <Handle
          type="target"
          position={Position.Top}
          draggable={false}
          isConnectable={false}
        />
      )}
    </div>
  );
});

type ContentProps = {
  id: string;
  nodeId: string;
  initialItemId: string;
  image: string | null;
  name: string;
  quantity: number;
  numberOfRecipes: number | null;
  facility: (typeof Facility)[number] | null;
};

const Content = memo(function InnerContent(props: ContentProps) {
  const {
    id,
    nodeId,
    initialItemId,
    image,
    name,
    facility,
    quantity,
    numberOfRecipes,
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
      <div className="w-full pl-1 pr-2 py-1">
        <div className="flex flex-row gap-2 items-center justify-center">
          {image && (
            <Image
              src={createImageUrlPath(image)}
              alt={name}
              width={24}
              height={24}
            />
          )}
          <div className="text-xs text-white">
            <span className="font-semibold">{quantity}x</span> {name}
          </div>

          <button
            onClick={handleToggleItem}
            className={cn(
              "nodrag",
              "text-emerald-700 cursor-pointer hover:text-emerald-500",
              added ? "text-white hover:text-white" : "",
            )}
          >
            {added ? <XSquareIcon width={16} /> : <PlusSquareIcon width={16} />}
          </button>
        </div>

        {numberOfRecipes !== null && numberOfRecipes > 1 && (
          <div className="pl-1 text-center text-xs text-yellow-400">
            {numberOfRecipes} recipes
          </div>
        )}
      </div>

      {facility && (
        <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-neutral-900 px-2 py-1 rounded-lg">
          {getFacilityIcon(facility)}
          {facility}
        </div>
      )}
    </>
  );
});

RootNode.displayName = "RootNode";

export default RootNode;
