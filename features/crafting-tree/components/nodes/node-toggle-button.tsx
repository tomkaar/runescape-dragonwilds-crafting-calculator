"use client";

import { useTrackedMaterialToggle } from "@/hooks/useTrackedMaterialToggle";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type Props = {
	id: string;
	nodeId: string;
	initialItemId: string;
	image: string | null;
	label: string;
	quantity: number;
	disabled?: boolean;
};

export function NodeToggleButton(props: Props) {
	const { id, nodeId, initialItemId, image, label, quantity, disabled } = props;

	const { toggle } = useTrackedMaterialToggle({
		initialItemId,
		nodeId,
		itemId: id,
		quantity,
	});

	return (
		<button
			type="button"
			onClick={toggle}
			className={cn(
				"flex flex-row gap-1 items-center pl-1 py-1",
				disabled && "pr-2",
			)}
			disabled={disabled}
		>
			{image && (
				<img
					src={createImageUrlPath(image)}
					alt={label}
					width={24}
					height={24}
				/>
			)}
			<div className="text-xs text-foreground">
				<span className="font-semibold">{quantity}x</span> {label}
			</div>
		</button>
	);
}
