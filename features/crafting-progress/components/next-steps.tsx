"use client";

import { Eye, EyeOff } from "lucide-react";
import { useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import type { SelectedMaterial } from "@/store/selected-material";
import { useNextStepsOptions } from "@/store/settings";

import {
	buildItemSteps,
	buildSteps,
	type StepEntry,
} from "../utils/build-steps";
import { buildOwnedMaterials } from "../utils/owned-materials";
import { buildProgressSummary } from "../utils/progress-summary";
import { CompletedStepRow, StepRow } from "./step-row";

type Props = {
	allItems: Record<string, SelectedMaterial[]>;
	filteredItemIds: string[];
};

export function NextSteps({ allItems, filteredItemIds }: Props) {
	const multipliers = useMaterialMultiplier((state) => state.items);
	const owned = useMaterialOwned((state) => state.owned);

	const steps = useMemo(
		() => buildSteps({ filteredItemIds, allItems, multipliers, owned }),
		[filteredItemIds, allItems, multipliers, owned],
	);
	const itemSteps = useMemo(
		() => buildItemSteps({ filteredItemIds, allItems, multipliers }),
		[filteredItemIds, allItems, multipliers],
	);
	const {
		showCovered,
		toggleShowCovered,
		showUsedFor,
		toggleShowUsedFor,
		showNeeded,
		toggleShowNeeded,
	} = useNextStepsOptions();
	const coveredCount = steps.filter((step) => step.covered).length;
	const visibleSteps = showCovered
		? steps
		: steps.filter((step) => !step.covered);
	const hasUsedFor = visibleSteps.some(
		(step) => !step.covered && step.parents.length > 0,
	);
	const hasNeeded =
		visibleSteps.some((step) => !step.covered && hasNeededMaterials(step)) ||
		itemSteps.some(hasNeededMaterials);

	const ownedRows = useMemo(
		() =>
			buildOwnedMaterials({
				trackedItemIds: filteredItemIds,
				allItems,
				multipliers,
				owned,
			}),
		[filteredItemIds, allItems, multipliers, owned],
	);
	const { readyCount, percentComplete } = buildProgressSummary(
		ownedRows,
		owned,
	);

	return (
		<AccordionPersisted>
			<AccordionItem
				value="progress-steps"
				className="bg-background rounded-lg border border-accent"
			>
				<AccordionTrigger className="text-foreground px-4">
					<div className="flex flex-col text-left">
						<span className="font-semibold text-sm">Next Steps</span>
						<span className="text-xs text-muted-foreground font-normal mt-0.5">
							Materials in crafting order — from raw ingredients up to finished
							pieces.
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4">
					{ownedRows.length > 0 && (
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">
									{readyCount} / {ownedRows.length} materials ready
								</span>
								<span className="font-semibold">{percentComplete}%</span>
							</div>
							<Progress value={percentComplete} className="h-1.5" />
						</div>
					)}

					{filteredItemIds.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							No items selected in the filter above.
						</p>
					) : (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col">
								{steps.length === 0 ? (
									<p className="text-xs text-muted-foreground pb-3">
										Mark materials as todo on the item cards to see your next
										steps here.
									</p>
								) : visibleSteps.length === 0 ? (
									<p className="text-xs text-muted-foreground pb-3">
										All marked steps are covered — nothing left to gather.
									</p>
								) : (
									<div className="flex flex-col divide-y divide-accent pb-2">
										{visibleSteps.map((step) =>
											step.covered ? (
												<CompletedStepRow key={step.itemId} step={step} />
											) : (
												<StepRow
													key={step.itemId}
													step={step}
													showUsedFor={showUsedFor}
													showNeeded={showNeeded}
												/>
											),
										)}
									</div>
								)}
								{/* Finished pieces always come last, set apart from the materials. */}
								<div className="pt-4 pb-2">
									<span className="font-semibold">Tracked items</span>
								</div>
								<div className="flex flex-col divide-y divide-accent pt-3">
									{itemSteps.map((itemStep) => (
										<StepRow
											key={itemStep.itemId}
											step={itemStep}
											showUsedFor={false}
											showNeeded={showNeeded}
										/>
									))}
								</div>
							</div>
							{(coveredCount > 0 || hasUsedFor || hasNeeded) && (
								<div className="flex flex-wrap gap-2 mt-2">
									{coveredCount > 0 && (
										<Button
											variant="outline"
											size="sm"
											onClick={toggleShowCovered}
										>
											{showCovered ? <Eye /> : <EyeOff />}
											{coveredCount} Completed
										</Button>
									)}
									{hasNeeded && (
										<Button
											variant="outline"
											size="sm"
											onClick={toggleShowNeeded}
										>
											{showNeeded ? <Eye /> : <EyeOff />}
											{showNeeded ? "Hide" : "Show"} required items
										</Button>
									)}
									{hasUsedFor && (
										<Button
											variant="outline"
											size="sm"
											onClick={toggleShowUsedFor}
										>
											{showUsedFor ? <Eye /> : <EyeOff />}
											Used for
										</Button>
									)}
								</div>
							)}
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}

function hasNeededMaterials(step: Pick<StepEntry, "needed">) {
	return (
		step.needed.materials.length > 0 || step.needed.alternatives.length > 0
	);
}
