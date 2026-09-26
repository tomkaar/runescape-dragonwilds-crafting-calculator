"use client";

import { Loader2 } from "lucide-react";

import Instruction from "@/features/crafting-progress/components/instruction";
import { ItemFilter } from "@/features/crafting-progress/components/item-filter";
import Items from "@/features/crafting-progress/components/items";
import { NextSteps } from "@/features/crafting-progress/components/next-steps";
import { useFilteredItemIds } from "@/features/crafting-progress/hooks/useFilteredItemIds";
import { useTrackedItemIds } from "@/features/crafting-progress/hooks/useTrackedItemIds";
import { cn } from "@/lib/utils";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";
import { CollectedMaterials } from "./collected-materials";
import { ExperienceSummary } from "./experience-summary";
import { FacilityChecklist } from "./facility-checklist";

export function ProgressPage() {
	const _hasHydrated = useStoreHydration(useSelectedMaterial);

	const items = useSelectedMaterial((state) => state.items);

	const trackedItemIds = useTrackedItemIds(items);
	const filteredItemIds = useFilteredItemIds(trackedItemIds);

	const trackedItems = trackedItemIds.map((id) => items[id]).length > 0;

	if (!_hasHydrated) {
		return (
			<div className="bg-dark-background h-full flex items-center justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="bg-dark-background h-full flex flex-col overflow-y-auto lg:overflow-hidden lg:flex-row gap-4 p-4">
			<div className="flex-1 lg:overflow-y-auto flex flex-col gap-4">
				<Instruction />
				<div className={cn(!trackedItems && "opacity-50")}>
					<Items />
				</div>
			</div>

			<div
				className={cn(
					"flex-2 flex flex-col gap-4 lg:min-h-0",
					!trackedItems && "opacity-50",
				)}
			>
				<ItemFilter
					trackedItemIds={trackedItemIds}
					filteredItemIds={filteredItemIds}
				/>

				<div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0">
					<div className="flex-1 lg:shrink-0 lg:overflow-y-auto flex flex-col gap-4">
						<CollectedMaterials filteredItemIds={filteredItemIds} />
						<FacilityChecklist
							allItems={items}
							filteredItemIds={filteredItemIds}
						/>
					</div>

					<div className="flex-1 flex flex-col gap-4 lg:shrink-0 lg:overflow-y-auto">
						<NextSteps allItems={items} filteredItemIds={filteredItemIds} />
						<ExperienceSummary
							allItems={items}
							filteredItemIds={filteredItemIds}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
