"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFacilitiesOwned } from "@/store/facilities-owned";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import type { SelectedMaterial } from "@/store/selected-material";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { useTrackedItemIds } from "../hooks/useTrackedItemIds";
import { buildFacilityChecklist } from "../utils/facility-checklist";
import { FacilitiesDialog } from "./facilities-dialog";

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

type Props = {
	allItems: Record<string, SelectedMaterial[]>;
};

function FacilityRow({
	facility,
	owned,
	onToggle,
}: {
	facility: string;
	owned: boolean;
	onToggle: (owned: boolean) => void;
}) {
	return (
		<div
			className={`flex items-center gap-2 py-1.5 text-sm${owned ? " opacity-40" : ""}`}
		>
			<Checkbox
				checked={owned}
				onCheckedChange={(checked) => onToggle(!!checked)}
			/>
			<span
				className={`flex items-center gap-2 flex-1 min-w-0${owned ? " line-through" : ""}`}
			>
				{getFacilityIcon(facility as (typeof Facility)[number], 20)}
				<span className="truncate">{facility}</span>
			</span>
		</div>
	);
}

export function FacilityChecklist({ allItems }: Props) {
	const trackedItemIds = useTrackedItemIds(allItems);
	const multipliers = useMaterialMultiplier((state) => state.items);
	const owned = useMaterialOwned((state) => state.owned);
	const facilitiesOwned = useFacilitiesOwned((state) => state.owned);
	const setFacilityOwned = useFacilitiesOwned((state) => state.setOwned);

	const { facilities, ambiguousItemNames } = useMemo(
		() =>
			buildFacilityChecklist({
				filteredItemIds: trackedItemIds,
				allItems,
				multipliers,
				owned,
			}),
		[trackedItemIds, allItems, multipliers, owned],
	);

	const stillRequired = facilities.filter((f) => !facilitiesOwned[f]);
	const alreadyOwned = facilities.filter((f) => facilitiesOwned[f]);

	return (
		<AccordionPersisted>
			<AccordionItem
				value="progress-facilities"
				className="bg-background rounded-lg border border-accent"
			>
				<AccordionTrigger className="text-foreground px-4">
					<div className="flex flex-col text-left">
						<span className="font-semibold text-sm">Facility Checklist</span>
						<span className="text-xs text-muted-foreground font-normal mt-0.5">
							Facilities you still need to unlock or build for this plan.
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent className="px-4 pb-4 text-foreground pt-4 flex flex-col gap-3">
					{facilities.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							Mark materials as todo on the item cards to see the facilities
							this plan needs.
						</p>
					) : (
						<div className="flex flex-col gap-4">
							{stillRequired.length > 0 && (
								<div className="flex flex-col">
									<span className="text-xs font-semibold text-muted-foreground mb-1">
										Still required
									</span>
									{stillRequired.map((facility) => (
										<FacilityRow
											key={facility}
											facility={facility}
											owned={false}
											onToggle={(checked) =>
												setFacilityOwned(facility, checked)
											}
										/>
									))}
								</div>
							)}

							{alreadyOwned.length > 0 && (
								<div className="flex flex-col">
									<span className="text-xs font-semibold text-muted-foreground mb-1">
										Owned
									</span>
									{alreadyOwned.map((facility) => (
										<FacilityRow
											key={facility}
											facility={facility}
											owned
											onToggle={(checked) =>
												setFacilityOwned(facility, checked)
											}
										/>
									))}
								</div>
							)}
						</div>
					)}

					{ambiguousItemNames.length > 0 && (
						<div className="flex items-start gap-1.5 text-xs text-amber-500">
							<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
							<span>
								Facilities may not be accurate for{" "}
								{listFormatter.format(ambiguousItemNames)} — multiple recipes
								are selected for the same item.
							</span>
						</div>
					)}

					<div className="flex justify-start">
						<FacilitiesDialog />
					</div>
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}
