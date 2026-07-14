"use client";

import { Loader2 } from "lucide-react";

import Instruction from "@/features/crafting-progress/components/instruction";
import Items from "@/features/crafting-progress/components/items";
import { NextSteps } from "@/features/crafting-progress/components/next-steps";
import { useTrackedItemIds } from "@/features/crafting-progress/hooks/useTrackedItemIds";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";
import { CollectedMaterials } from "./collected-materials";

export function ProgressPage() {
	const _hasHydrated = useStoreHydration(useSelectedMaterial);

	const items = useSelectedMaterial((state) => state.items);

	const trackedItemIds = useTrackedItemIds(items);

	if (!_hasHydrated) {
		return (
			<div className="bg-dark-background h-full flex items-center justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!trackedItemIds.length) {
		return <Instruction />;
	}

	return (
		<div className="bg-dark-background h-full flex flex-col overflow-y-auto lg:overflow-hidden lg:flex-row gap-4 p-4">
			<div className="flex-1 lg:overflow-y-auto">
				<Items />
			</div>

			<div className="flex-1 lg:shrink-0 lg:overflow-y-auto flex flex-col gap-4">
				<CollectedMaterials trackedItemIds={trackedItemIds} />
			</div>

			<div className="flex-1 lg:shrink-0 lg:overflow-y-auto">
				<NextSteps allItems={items} />
			</div>
		</div>
	);
}
