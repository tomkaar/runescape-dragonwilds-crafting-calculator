import { type OptionVariantNode } from "@/utils/recipeTree/type";
import { Handle, Position } from "@xyflow/react";
import { forwardRef } from "react";

type Props = OptionVariantNode;

const OptionVariantNode = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-400 px-2 py-1 rounded-lg"
      ref={ref}
    >
      <div className="flex flex-row items-center justify-center">
        <div className="text-xs text-yellow-400">
          Recipe {props.data.optionNumber}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        draggable={false}
        isConnectable={false}
        className="handle-option"
      />
      <Handle
        type="target"
        position={Position.Top}
        draggable={false}
        isConnectable={false}
        className="handle-option"
      />
    </div>
  );
});

OptionVariantNode.displayName = "OptionVariantNode";

export default OptionVariantNode;
