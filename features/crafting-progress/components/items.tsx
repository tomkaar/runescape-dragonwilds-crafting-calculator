import { AccordionPersisted } from "@/components/accordion-persisted";
import { ItemCard } from "@/features/crafting-progress/components/item-card";
import { useSelectedMaterial } from "@/store/selected-material";
import { sourceItemById } from "@/utils/source-item-by-id";
import { useTrackedItemIds } from "../hooks/useTrackedItemIds";

export default function Items() {
	const items = useSelectedMaterial((state) => state.items);
	const trackedItemIds = useTrackedItemIds(items);

	return (
		<>
			<div className="bg-background rounded-lg border border-accent p-4 mb-2">
				<h2 className="font-semibold text-sm">Items</h2>
				<p className="text-xs text-muted-foreground mt-0.5">
					Your tracked items. Mark materials as todo and set a multiplier if you
					need more than one to track your progress. They will be added to the
					progress summary and next steps.
				</p>
			</div>

			<AccordionPersisted className="flex flex-col gap-2">
				{trackedItemIds.map((itemId) => {
					const item = sourceItemById(itemId);
					if (!item) return null;
					return <ItemCard key={itemId} itemId={itemId} item={item} />;
				})}
			</AccordionPersisted>
		</>
	);
}
