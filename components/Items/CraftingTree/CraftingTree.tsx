import { Panel } from "@xyflow/react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CraftingTree } from "@/features/crafting-tree/components/crafting-tree";
import { ClearSelected } from "../../../features/crafting-tree/components/actions/clear-selected";
import { Direction } from "../../../features/crafting-tree/components/actions/direction";

export function AccordionCraftingTree({ itemId }: { itemId: string }) {
	return (
		<AccordionItem
			value="crafting-tree"
			className="bg-background rounded-lg border border-accent"
		>
			<AccordionTrigger className="text-foreground px-4">
				<div className="flex flex-col">
					Crafting Tree
					<span className="text-xs text-muted-foreground">
						See the full crafting tree for this item.
					</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="h-100">
				<CraftingTree itemId={itemId}>
					<Panel position="top-right" className="flex gap-2">
						<ClearSelected itemId={itemId} />
						<Direction />
					</Panel>
				</CraftingTree>
			</AccordionContent>
		</AccordionItem>
	);
}
