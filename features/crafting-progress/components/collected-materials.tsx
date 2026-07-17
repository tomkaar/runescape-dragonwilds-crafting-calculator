"use client";

import { AccordionPersisted } from "@/components/accordion-persisted";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { OwnedMaterialEntry } from "@/features/crafting-progress/types/owned-material-entry";

import { buildOwnedMaterials } from "@/features/crafting-progress/utils/owned-materials";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import { useSelectedMaterial } from "@/store/selected-material";
import { CollectedMaterialsRow } from "./collected-materials-row";

type Props = {
	trackedItemIds: string[];
};

export function CollectedMaterials({ trackedItemIds }: Props) {
	const allItems = useSelectedMaterial((state) => state.items);
	const multipliers = useMaterialMultiplier((state) => state.items);
	const markAsDoneByNodeId = useSelectedMaterial(
		(state) => state.markAsDoneByNodeId,
	);
	const markAsTodoByNodeId = useSelectedMaterial(
		(state) => state.markAsTodoByNodeId,
	);
	const owned = useMaterialOwned((state) => state.owned);
	const setOwned = useMaterialOwned((state) => state.setOwned);
	const resetOwned = useMaterialOwned((state) => state.resetOwned);

	const rows = buildOwnedMaterials({
		trackedItemIds,
		allItems,
		multipliers,
	}).sort((a, b) => a.name.localeCompare(b.name));

	const commit = (entry: OwnedMaterialEntry, qty: number) => {
		setOwned(entry.itemId, qty);
		const done = qty >= entry.needed;
		for (const ref of entry.nodeRefs) {
			if (done) markAsDoneByNodeId(ref.trackedItemId, ref.nodeId);
			else markAsTodoByNodeId(ref.trackedItemId, ref.nodeId);
		}
	};

	return (
		<AccordionPersisted>
			<AccordionItem
				value="progress-owned-materials"
				className="bg-background rounded-lg border border-accent"
			>
				<AccordionTrigger className="text-foreground px-4">
					<div className="flex flex-col text-left">
						<span className="font-semibold text-sm">Collected Materials</span>
						<span className="text-xs text-muted-foreground font-normal mt-0.5">
							Enter how many of each material you currently own to track your
							progress.
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent className="px-4 pb-4 text-foreground pt-4">
					{rows.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							Mark materials on the item cards to see them here.
						</p>
					) : (
						<div className="flex flex-col">
							{rows.map((entry) => (
								<CollectedMaterialsRow
									key={entry.itemId}
									entry={entry}
									owned={owned[entry.itemId] ?? 0}
									onCommit={(qty) => commit(entry, qty)}
								/>
							))}
							<div className="mt-4">
								<ConfirmAlertDialog
									trigger={
										<Button
											variant="outline"
											size="sm"
											className="ml-auto text-destructive hover:text-destructive"
										>
											<span className="hidden md:inline lg:hidden xl:inline">
												Reset collected materials
											</span>
										</Button>
									}
									title="Reset progress?"
									description="This will clear all tracked materials for all items. This action cannot be undone."
									confirmLabel="Remove"
									onConfirm={resetOwned}
								/>
							</div>
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}
