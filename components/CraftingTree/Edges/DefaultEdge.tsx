import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";
import { Edge } from "../edges";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  label,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<Edge>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = data.highlighted
    ? "rgb(249, 234, 149)"
    : selected
      ? "#777"
      : "#888";
  const strokeDasharray = data.highlighted ? "3.1" : "0";

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ stroke, strokeDasharray }}
      label={label}
    />
  );
}
