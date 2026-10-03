"use client";

import Link from "next/link";
import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import type { OwnedMaterialEntry } from "@/features/crafting-progress/types/owned-material-entry";
import { useClampedNumberInput } from "@/hooks/useClampedNumberInput";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { MissingMarkingsDialog } from "./missing-markings-dialog";

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
	const isDone = owned >= entry.adjustedValue;
	const hasWarning = entry.missingPaths.length > 0;
	// Faded per element rather than on the row, so a warning stays fully
	// visible on a done row — that's when an undercount matters most.
	const doneFade = isDone ? " opacity-40" : "";

	const { inputValue, onChange, onBlur } = useClampedNumberInput({
		value: owned,
		onCommit,
		min: 0,
	});

	return (
		<div className="flex flex-row items-center gap-2 py-1.5 text-sm">
			<Checkbox
				className={doneFade}
				checked={isDone}
				onCheckedChange={(checked) =>
					onCommit(checked ? entry.adjustedValue : 0)
				}
			/>

			<div className="flex flex-row items-center gap-2 flex-1 min-w-0 ml-2">
				<Link
					href={{ pathname: `/item/${entry.itemId}` }}
					prefetch={false}
					className={`flex flex-row items-center gap-2 min-w-0 hover:opacity-80${isDone ? " line-through" : ""}`}
				>
					{entry.image && (
						<img
							src={createImageUrlPath(entry.image)}
							alt={entry.name}
							width={24}
							height={24}
							className={`shrink-0 size-6${doneFade}`}
						/>
					)}
					<span
						className={`truncate${hasWarning ? " text-amber-500" : doneFade}`}
					>
						{entry.name}
					</span>
				</Link>
				{hasWarning && (
					<MissingMarkingsDialog
						materialId={entry.itemId}
						materialName={entry.name}
						missingPaths={entry.missingPaths}
					/>
				)}
			</div>

			<InputGroup className={`w-12 h-6${doneFade}`}>
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
			<span className={`${isDone ? "line-through" : ""}${doneFade}`}>of</span>
			<span
				className={`font-semibold${isDone ? " line-through" : ""}${doneFade}`}
			>
				{entry.adjustedValue}×
			</span>
			<span
				className={`text-muted-foreground${isDone ? " line-through" : ""}${doneFade}`}
			>
				({entry.total})
			</span>
		</div>
	);
});
