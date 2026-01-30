import { type MaterialNode } from "@/utils/recipeTree/type";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import { forwardRef } from "react";

type Props = MaterialNode;

const MaterialNode = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      className="flex flex-col items-center justify-center bg-neutral-800 px-2 py-2 rounded-lg"
      ref={ref}
    >
      <div className="flex flex-row items-center justify-center">
        {props.data.image && (
          <Image
            src={props.data.image}
            alt={props.data.name}
            width={24}
            height={24}
          />
        )}
        <div className="text-xs text-white">
          <span className="font-bold">{props.data.quantity}x</span>{" "}
          {props.data.name}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        draggable={false}
        isConnectable={false}
      />
    </div>
  );
});

MaterialNode.displayName = "MaterialNode";

export default MaterialNode;
