"use client";

import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

import { type MaterialNode } from "../types";
import { createImageUrlPath } from "@/scripts/utils/createImageUrl";
import { forwardRef, memo } from "react";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { PlusSquareIcon, SquareCheck } from "lucide-react";
import { Facility } from "@/Types";
import { useSelectedMaterial } from "@/store/selected-material";

type Props = MaterialNode;

const MaterialNode = forwardRef<HTMLDivElement, Props>(
  function InnerMaterialNode(props, ref) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center bg-neutral-800 border border-neutral-800 rounded-lg"
      >
        <Content
          id={props.data.id}
          nodeId={props.id}
          initialItemId={props.data.initialItemId}
          image={props.data.image}
          name={props.data.name}
          facility={props.data.facility}
          quantity={props.data.quantity}
        />
        <Handle
          type="target"
          position={Position.Top}
          draggable={false}
          isConnectable={false}
        />
        {!props.data.end && (
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
  name: string;
  quantity: number;
  facility: (typeof Facility)[number] | null;
};

const Content = memo(function InnerContent(props: ContentProps) {
  const { id, nodeId, initialItemId, image, name, facility, quantity } = props;
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
      <div className="flex flex-row gap-1 items-center justify-center pl-1 pr-2 py-1">
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
          className="text-emerald-700 cursor-pointer hover:text-emerald-500"
        >
          {added ? <SquareCheck width={16} /> : <PlusSquareIcon width={16} />}
        </button>
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

MaterialNode.displayName = "MaterialNode";

export default MaterialNode;
