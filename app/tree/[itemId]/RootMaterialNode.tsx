import { RootNode } from "@/utils/recipeTree/type";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

type Props = RootNode;

export default function ItemNode(props: Props) {
  return (
    <div className="flex flex-col items-center justify-center bg-neutral-800 px-2 py-2 rounded-lg">
      <div className="flex flex-row items-center justify-center">
        {props.data.image && (
          <Image
            src={props.data.image}
            alt={props.data.name}
            width={24}
            height={24}
          />
        )}
        <div className="text-xs">{props.data.quantity}x</div>
      </div>

      {props.data.numberOfRecipes > 1 && (
        <div className="ml-1 text-xs text-yellow-400">
          ({props.data.numberOfRecipes} recipes)
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        draggable={false}
        isConnectable={false}
      />
      {props.data.hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          draggable={false}
          isConnectable={false}
        />
      )}
    </div>
  );
}
