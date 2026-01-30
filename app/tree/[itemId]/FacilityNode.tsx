import getFacilityIcon from "@/utils/getFacilityIcon";
import { type FacilityNode } from "@/utils/recipeTree/type";
import { Handle, Position } from "@xyflow/react";

type Props = FacilityNode;

export default function FacilityNode(props: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-1 p-1 px-2 border-2 border-dashed border-neutral-800 rounded-full">
        {props.data.facility ? getFacilityIcon(props.data.facility) : null}{" "}
        <span className="text-xs text-white">{props.data.facility}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
