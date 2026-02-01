"use client";

import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import { type RootNode } from "../types";
import { createImageUrlPath } from "@/playground/items/utils/image";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { forwardRef } from "react";

type Props = RootNode;

const RootNode = forwardRef<HTMLDivElement, Props>(function InnerRootNode(
  props: Props,
  ref,
) {
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center bg-neutral-800 border border-neutral-800 rounded-lg"
    >
      <div className="w-full pl-1 pr-2 py-1">
        <div className="flex flex-row items-center justify-center">
          {props.data.image && (
            <Image
              src={createImageUrlPath(props.data.image)}
              alt={props.data.name}
              width={24}
              height={24}
            />
          )}
          <div className="text-xs text-white">
            {props.data.quantity}x {props.data.name}
          </div>
        </div>

        {props.data.numberOfRecipes > 1 && (
          <div className="text-center text-xs text-yellow-400">
            {props.data.numberOfRecipes} possible recipes
          </div>
        )}
      </div>

      {props.data.facility && (
        <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-neutral-900 px-2 py-1 rounded-lg">
          {getFacilityIcon(props.data.facility)}
          {props.data.facility}
        </div>
      )}

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

RootNode.displayName = "RootNode";

export default RootNode;
