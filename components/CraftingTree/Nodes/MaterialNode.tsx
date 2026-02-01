"use client";

import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

import { type MaterialNode } from "../types";
import { createImageUrlPath } from "@/scripts/utils/createImageUrl";
import { forwardRef } from "react";
import getFacilityIcon from "@/utils/getFacilityIcon";

type Props = MaterialNode;

const MaterialNode = forwardRef<HTMLDivElement, Props>(
  function InnerMaterialNode(props, ref) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center bg-neutral-800 border border-neutral-800 rounded-lg"
      >
        <div className="flex flex-row gap-1 items-center justify-center pl-1 pr-2 py-1">
          {props.data.image && (
            <Image
              src={createImageUrlPath(props.data.image)}
              alt={props.data.name}
              width={24}
              height={24}
            />
          )}
          <div className="text-xs text-white">
            <span className="font-semibold">{props.data.quantity}x</span>{" "}
            {props.data.name}
          </div>
        </div>

        {props.data.facility && (
          <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-neutral-900 px-2 py-1 rounded-lg">
            {getFacilityIcon(props.data.facility)}
            {props.data.facility}
          </div>
        )}

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

MaterialNode.displayName = "MaterialNode";

export default MaterialNode;
