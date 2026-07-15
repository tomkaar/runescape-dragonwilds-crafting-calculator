"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import type { SelectedMaterial } from "@/store/selected-material";
import { useStepsFilter } from "@/store/steps-filter";
import { sourceItemById } from "@/utils/source-item-by-id";

import { useTrackedItemIds } from "../hooks/useTrackedItemIds";
import { buildSteps } from "../utils/build-steps";
import { buildOwnedMaterials } from "../utils/owned-materials";
import { buildProgressSummary } from "../utils/progress-summary";

type Props = {
	allItems: Record<string, SelectedMaterial[]>;
};

type ItemOption = { value: string; label: string; image: string | null };

export function NextSteps({ allItems }: Props) {
	const trackedItemIds = useTrackedItemIds(allItems);
	const multipliers = useMaterialMultiplier((state) => state.items);
	const owned = useMaterialOwned((state) => state.owned);
	const { isAll, selectedIds, setSelected } = useStepsFilter();
	const itemsAnchor = useComboboxAnchor();

	const filteredItemIds = useMemo(
		() =>
			isAll
				? trackedItemIds
				: selectedIds.filter((id) => trackedItemIds.includes(id)),
		[isAll, selectedIds, trackedItemIds],
	);

	const itemOptions = useMemo(
		() =>
			trackedItemIds.reduce<ItemOption[]>((acc, id) => {
				const item = sourceItemById(id);
				if (item) acc.push({ value: id, label: item.name, image: item.image });
				return acc;
			}, []),
		[trackedItemIds],
	);

	const steps = useMemo(
		() => buildSteps({ filteredItemIds, allItems, multipliers, owned }),
		[filteredItemIds, allItems, multipliers, owned],
	);

	const ownedRows = useMemo(
		() => buildOwnedMaterials({ trackedItemIds, allItems, multipliers }),
		[trackedItemIds, allItems, multipliers],
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

				<AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4 pt-4">
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

					{trackedItemIds.length > 1 && (
						<div className="flex flex-col gap-1 pb-2">
							<Combobox
								multiple
								autoHighlight
								items={itemOptions}
								value={itemOptions.filter((o) =>
									filteredItemIds.includes(o.value),
								)}
								onValueChange={(values: ItemOption[], evt) => {
									evt.event.stopPropagation();
									setSelected(
										values.map((v) => v.value),
										trackedItemIds,
									);
								}}
								itemToStringValue={(item: ItemOption) => item.label}
							>
								<ComboboxChips ref={itemsAnchor} className="w-full max-w-md">
									<ComboboxValue>
										{(values: ItemOption[]) => (
											<>
												{values.map(({ value, label, image }) => (
													<ComboboxChip key={value}>
														{image && (
															<img
																src={createImageUrlPath(image)}
																alt={label}
																width={14}
																height={14}
																className="shrink-0"
															/>
														)}
														{label}
													</ComboboxChip>
												))}
												<ComboboxChipsInput
													placeholder="Filter items…"
													className="text-xs"
												/>
											</>
										)}
									</ComboboxValue>
								</ComboboxChips>
								<ComboboxContent anchor={itemsAnchor}>
									<ComboboxEmpty>No items found.</ComboboxEmpty>
									<ComboboxList>
										{(option: ItemOption) => (
											<ComboboxItem
												key={option.value}
												value={option}
												className="text-xs"
											>
												{option.image && (
													<img
														src={createImageUrlPath(option.image)}
														alt={option.label}
														width={14}
														height={14}
														className="shrink-0"
													/>
												)}
												{option.label}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
							<span className="text-xs text-muted-foreground">
								{filteredItemIds.length} / {trackedItemIds.length} selected
							</span>
						</div>
					)}

					{filteredItemIds.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							Select items above to see their next steps.
						</p>
					) : steps.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							Mark materials as todo on the item cards to see your next steps
							here.
						</p>
					) : (
						<div className="flex flex-col divide-y divide-accent">
							{steps.map((step) => (
								<div
									key={step.itemId}
									className="flex flex-col gap-0.5 py-2 text-sm first:pt-0 last:pb-0"
								>
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
									{step.parents.length > 0 && (
										<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
											<span>Used for:</span>
											{step.parents.map((p, i) => (
												<span
													key={p.itemId}
													className="flex items-center gap-1"
												>
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
									{step.coverageWarnings.length > 0 && (
										<div className="flex flex-col gap-0.5 pt-1 pl-7">
											{step.coverageWarnings.map((w) => (
												<div
													key={w.parentItemId}
													className="flex items-start gap-1 text-xs text-amber-500"
												>
													<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
													<span>
														{listFormatter.format(
															w.missingRoots.map((r) => r.name),
														)}{" "}
														{w.missingRoots.length === 1 ? "needs" : "need"}{" "}
														{w.parentName} too, but{" "}
														{w.missingRoots.length === 1 ? "hasn't" : "haven't"}{" "}
														marked this material as a step — this total may be
														higher than currently shown.
													</span>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});
