import { BaseEdge, type EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useCraftingTreeHover } from "@/features/crafting-tree/context/crafting-tree-hover";
import type { Edge } from "@/features/crafting-tree/schemas/Edge";

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
	target,
	data,
}: EdgeProps<Edge>) {
	const { check, isSet } = useCraftingTreeHover();
	const isHovered = check(target);

	const [edgePath] = getSmoothStepPath({
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

	return (
		<BaseEdge
			id={id}
			path={edgePath}
			style={{ stroke, opacity: isSet && !isHovered ? 0.25 : 1 }}
			label={label}
			className="edge-animated"
		/>
	);
}
