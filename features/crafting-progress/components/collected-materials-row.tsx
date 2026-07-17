"use client";

import Link from "next/link";
import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import type { OwnedMaterialEntry } from "@/features/crafting-progress/types/owned-material-entry";
import { useClampedNumberInput } from "@/hooks/useClampedNumberInput";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type Props = {
	entry: OwnedMaterialEntry;
	owned: number;
	onCommit: (qty: number) => void;
};

export const CollectedMaterialsRow = memo(function CollectedMaterialsRow({
	entry,
	owned,
	onCommit,
}: Props) {
	const isDone = entry.needed > 0 && owned >= entry.needed;

	const { inputValue, onChange, onBlur } = useClampedNumberInput({
		value: owned,
		onCommit,
		min: 0,
	});

	return (
		<div
			className={`flex flex-row items-center gap-2 py-1.5 text-sm${isDone ? " opacity-40" : ""}`}
		>
			<Checkbox
				checked={isDone}
				onCheckedChange={(checked) => onCommit(checked ? entry.needed : 0)}
			/>

			<Link
				href={{ pathname: `/item/${entry.itemId}` }}
				prefetch={false}
				className={`flex flex-row items-center gap-2 flex-1 min-w-0 ml-2 hover:opacity-80${isDone ? " line-through" : ""}`}
			>
				{entry.image && (
					<img
						src={createImageUrlPath(entry.image)}
						alt={entry.name}
						width={24}
						height={24}
						className="shrink-0 size-6"
					/>
				)}
				<span className="truncate">{entry.name}</span>
			</Link>

			<InputGroup className="w-12 h-6">
				<InputGroupInput
					type="number"
					min={0}
					autoComplete="off"
					value={inputValue}
					onChange={onChange}
					onBlur={onBlur}
					className="px-1 text-center"
				/>
			</InputGroup>
			<span className={`${isDone ? " line-through" : ""}`}>of</span>
			<span className={`font-semibold${isDone ? " line-through" : ""}`}>
				{entry.needed}×
			</span>
		</div>
	);
});
