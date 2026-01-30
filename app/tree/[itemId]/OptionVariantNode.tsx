import { type OptionVariantNode } from "@/utils/recipeTree/type";
import { Handle, Position } from "@xyflow/react";

type Props = OptionVariantNode;

export default function OptionVariantNode(props: Props) {
  return (
    <div className="flex flex-col items-center justify-center bg-yellow-400 px-2 py-2 rounded-lg">
      <div className="flex flex-row items-center justify-center">
        <div className="text-xs text-black">
          Recipe {props.data.optionNumber}
        </div>
      </div>

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
}
