"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import type { SelectedMaterial } from "@/store/selected-material";
import { useStepsFilter } from "@/store/steps-filter";

import { getSkillImageUrl } from "@/utils/getSkillImageUrl";
import { useTrackedItemIds } from "../hooks/useTrackedItemIds";
import { buildExperienceSummary } from "../utils/experience-summary";

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

type Props = {
	allItems: Record<string, SelectedMaterial[]>;
};

export function ExperienceSummary({ allItems }: Props) {
	const trackedItemIds = useTrackedItemIds(allItems);
	const multipliers = useMaterialMultiplier((state) => state.items);
	const owned = useMaterialOwned((state) => state.owned);
	const { isAll, selectedIds } = useStepsFilter();

	const filteredItemIds = useMemo(
		() =>
			isAll
				? trackedItemIds
				: selectedIds.filter((id) => trackedItemIds.includes(id)),
		[isAll, selectedIds, trackedItemIds],
	);

	const { totals, ambiguousItemNames } = useMemo(
		() =>
			buildExperienceSummary({ filteredItemIds, allItems, multipliers, owned }),
		[filteredItemIds, allItems, multipliers, owned],
	);

	return (
		<AccordionPersisted>
			<AccordionItem
				value="progress-experience"
				className="bg-background rounded-lg border border-accent"
			>
				<AccordionTrigger className="text-foreground px-4">
					<div className="flex flex-col text-left">
						<span className="font-semibold text-sm">Experience Gained</span>
						<span className="text-xs text-muted-foreground font-normal mt-0.5">
							XP you'll earn from crafting everything in your next steps.
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent className="px-4 pb-4 text-foreground pt-4 flex flex-col gap-3">
					{totals.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							No experience to show yet — mark materials as todo on the item
							cards, or none of your planned crafts grant skill experience.
						</p>
					) : (
						<div className="flex flex-col divide-y divide-accent">
							{totals.map((entry) => (
								<div
									key={entry.skill}
									className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0"
								>
									<span className="flex items-center gap-2 font-semibold">
										<img
											src={getSkillImageUrl(entry.skill)}
											alt={entry.skill}
											width={20}
											height={20}
											className="shrink-0"
										/>
										{entry.skill}
									</span>
									<span className="text-muted-foreground">
										{entry.experience.toLocaleString()} XP
									</span>
								</div>
							))}
						</div>
					)}

					{ambiguousItemNames.length > 0 && (
						<div className="flex items-start gap-1.5 text-xs text-amber-500">
							<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
							<span>
								Experience may not be accurate for{" "}
								{listFormatter.format(ambiguousItemNames)} — multiple recipes
								are selected for the same item.
							</span>
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}
