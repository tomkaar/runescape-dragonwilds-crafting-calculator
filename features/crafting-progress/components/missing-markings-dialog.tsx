"use client";

import { ChevronRight, Plus, TriangleAlert } from "lucide-react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { MissingMarking } from "@/features/crafting-progress/types/owned-material-entry";
import { findBaseQuantity } from "@/features/crafting-progress/utils/base-quantity";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useSelectedMaterial } from "@/store/selected-material";

type Props = {
	materialId: string;
	materialName: string;
	missingPaths: MissingMarking[];
};

export function MissingMarkingsDialog({
	materialId,
	materialName,
	missingPaths,
}: Props) {
	const addAnItem = useSelectedMaterial((state) => state.addAnItem);

	// Builds the same entry the item cards' checkbox does, so the marking is
	// indistinguishable from one made there. Once every gap is filled the row's
	// warning — and this dialog with it — unmounts.
	const add = (trackedItemId: string, nodeId: string) => {
		addAnItem(trackedItemId, {
			id: self.crypto.randomUUID(),
			itemId: materialId,
			quantity: findBaseQuantity(trackedItemId, nodeId) ?? 0,
			nodeId,
			nodeOriginalId: trackedItemId,
			state: "TODO",
		});
	};

	return (
		<Dialog>
			<DialogTrigger
				aria-label="Show warning"
				className="shrink-0 text-amber-500 hover:opacity-80"
			>
				<TriangleAlert className="size-4" />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<TriangleAlert className="size-5 shrink-0 text-amber-500" />
						{materialName} may be undercounted
					</DialogTitle>
					<DialogDescription>
						{materialName} is marked elsewhere, but not in these places, so the
						total shown may be lower than you actually need:
					</DialogDescription>
				</DialogHeader>
				<ul className="flex flex-col gap-2 text-sm">
					{missingPaths.map((missing) => (
						<li
							key={missing.path.map((s) => s.itemId).join(">")}
							className="flex flex-wrap items-center gap-1"
						>
							{missing.path.map((segment, i) => (
								<Fragment
									key={missing.path
										.slice(0, i + 1)
										.map((s) => s.itemId)
										.join(">")}
								>
									{i > 0 && (
										<ChevronRight className="size-3.5 text-muted-foreground" />
									)}
									<span className="flex items-center gap-1">
										{segment.image && (
											<img
												src={createImageUrlPath(segment.image)}
												alt={segment.name}
												width={16}
												height={16}
												className="shrink-0"
											/>
										)}
										{segment.name}
									</span>
								</Fragment>
							))}
							{missing.anyRecipe && (
								<span className="text-muted-foreground">(any recipe)</span>
							)}
							<span className="ml-auto flex flex-wrap gap-1">
								{missing.targets.map((target) => (
									<Button
										key={target.nodeId}
										variant="outline"
										size="xs"
										onClick={() => add(missing.trackedItemId, target.nodeId)}
									>
										<Plus />
										{missing.targets.length === 1 &&
										target.recipeNumber === null
											? "Add"
											: `Add (Recipe ${target.recipeNumber})`}
									</Button>
								))}
							</span>
						</li>
					))}
				</ul>
				<p className="text-sm text-muted-foreground">
					Add {materialName} here, or mark it on the item cards.
				</p>
				<DialogFooter showCloseButton />
			</DialogContent>
		</Dialog>
	);
}
