"use client";

import { Plus, TriangleAlert } from "lucide-react";
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
import { useAddMarking } from "@/features/crafting-progress/hooks/useAddMarking";
import type { MissingMarking } from "@/features/crafting-progress/types/owned-material-entry";
import { MaterialPath } from "./material-path";

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
	// Once every gap is filled the row's warning — and this dialog with it —
	// unmounts.
	const addMarking = useAddMarking();

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
							<MaterialPath path={missing.path} />
							{missing.anyRecipe && (
								<span className="text-muted-foreground">(any recipe)</span>
							)}
							<span className="ml-auto flex flex-wrap gap-1">
								{missing.targets.map((target) => (
									<Button
										key={target.nodeId}
										variant="outline"
										size="xs"
										onClick={() =>
											addMarking(
												missing.trackedItemId,
												materialId,
												target.nodeId,
											)
										}
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
