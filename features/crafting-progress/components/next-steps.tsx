"use client";

import { Check, Eye, EyeOff, TriangleAlert } from "lucide-react";
import { Fragment, useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import { useNextStepsOptions } from "@/store/next-steps-options";
import type { SelectedMaterial } from "@/store/selected-material";

import {
	buildItemSteps,
	buildSteps,
	type ItemStepEntry,
	type NeededMaterial,
	type StepEntry,
} from "../utils/build-steps";
import { buildOwnedMaterials } from "../utils/owned-materials";
import { buildProgressSummary } from "../utils/progress-summary";

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
												<div
													key={step.itemId}
													className="flex items-center gap-2 py-2 text-sm opacity-50 first:pt-0"
												>
													{step.image && (
														<img
															src={createImageUrlPath(step.image)}
															alt={step.name}
															width={20}
															height={20}
															className="shrink-0 size-5"
														/>
													)}
													<span className="font-semibold">{step.name}</span>
													<Check className="size-4 shrink-0 text-green-500" />
												</div>
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

function StepRow({
	step,
	showUsedFor,
	showNeeded,
}: {
	step: StepEntry | ItemStepEntry;
	showUsedFor: boolean;
	showNeeded: boolean;
}) {
	// Resolved ingredients first, then one "or" group per candidate recipe
	// for the part whose recipe hasn't been picked yet.
	const neededGroups = [
		...(step.needed.materials.length > 0 ? [step.needed.materials] : []),
		...step.needed.alternatives,
	];
	const alternativesStart =
		neededGroups.length - step.needed.alternatives.length;

	return (
		<div className="flex flex-col gap-0.5 py-2 text-sm first:pt-0 last:pb-0">
			<div className="flex items-center gap-2">
				{step.image && (
					<img
						src={createImageUrlPath(step.image)}
						alt={step.name}
						width={20}
						height={20}
						className="shrink-0 size-5"
					/>
				)}
				<span className="font-semibold">
					{step.quantity}× {step.name}
				</span>
			</div>
			{showNeeded && neededGroups.length > 0 && (
				<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
					<span>Required item{neededGroups.length > 1 ? "s" : ""}:</span>
					{neededGroups.map((group, groupIndex) => (
						<Fragment key={group.map((m) => m.itemId).join("|")}>
							{groupIndex > alternativesStart && (
								<span className="italic opacity-70">or</span>
							)}
							{groupIndex === alternativesStart && groupIndex > 0 && (
								<span className="italic opacity-70">+ one of</span>
							)}
							<NeededMaterialList materials={group} />
						</Fragment>
					))}
				</div>
			)}
			{showUsedFor && "parents" in step && step.parents.length > 0 && (
				<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
					<span>Used for:</span>
					{step.parents.map((p, i) => (
						<span key={p.itemId} className="flex items-center gap-1">
							{p.image && (
								<img
									src={createImageUrlPath(p.image)}
									alt={p.name}
									width={14}
									height={14}
									className="shrink-0"
								/>
							)}
							{p.quantity}× {p.name}
							{i < step.parents.length - 1 && ","}
						</span>
					))}
				</div>
			)}
			{"coverageWarnings" in step && step.coverageWarnings.length > 0 && (
				<div className="flex flex-col gap-0.5 pt-1 pl-7">
					{step.coverageWarnings.map((w) => (
						<div
							key={w.parentItemId}
							className="flex items-start gap-1 text-xs text-amber-500"
						>
							<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
							<span>
								{listFormatter.format(w.missingRoots.map((r) => r.name))}{" "}
								{w.missingRoots.length === 1 ? "needs" : "need"} {w.parentName}{" "}
								too, but {w.missingRoots.length === 1 ? "hasn't" : "haven't"}{" "}
								marked this material as a step — this total may be higher than
								currently shown.
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function NeededMaterialList({ materials }: { materials: NeededMaterial[] }) {
	return materials.map((m, i) => (
		<span key={m.itemId} className="flex items-center gap-1">
			{m.image && (
				<img
					src={createImageUrlPath(m.image)}
					alt={m.name}
					width={14}
					height={14}
					className="shrink-0"
				/>
			)}
			{m.quantity}× {m.name}
			{i < materials.length - 1 && ","}
		</span>
	));
}

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});
