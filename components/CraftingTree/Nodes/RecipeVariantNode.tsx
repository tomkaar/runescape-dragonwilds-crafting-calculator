"use client";

import { Handle, Position } from "@xyflow/react";
import { type RecipeVariantNode } from "../types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { forwardRef } from "react";

type Props = RecipeVariantNode;

const RecipeVariantNode = forwardRef<HTMLDivElement, Props>(
  function InnerRecipeVariantNode(props: Props, ref) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center bg-neutral-800 border border-neutral-800 rounded-lg"
      >
        <div className="flex flex-row items-center justify-center pl-1 pr-2 py-1.5">
          <div className="text-xs text-yellow-400">
            Recipie {props.data.optionNumber}
          </div>
        </div>

        {props.data.facility && (
          <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-200 bg-neutral-900 px-2 py-1 rounded-lg">
            {getFacilityIcon(props.data.facility)}
            <span>{props.data.facility}</span>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          draggable={false}
          isConnectable={false}
        />
        <Handle
          type="target"
          position={Position.Top}
          draggable={false}
          isConnectable={false}
        />
      </div>
    );
  },
);

RecipeVariantNode.displayName = "RecipeVariantNode";

export default RecipeVariantNode;
