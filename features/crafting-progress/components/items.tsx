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
			{Object.keys(items).length === 0 ? (
				<div className="bg-background rounded-lg border border-accent p-4 mb-2">
					<h2 className="font-semibold text-sm">Items</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						Your tracked items will be visible here.
					</p>
				</div>
			) : null}

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
