import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { getUsedIn } from "../utils/get-used-in";
import { UsedInList } from "./used-in-list";

export function AccordionUsedIn({ itemId }: { itemId: string }) {
	const usedIn = getUsedIn(itemId);

	if (usedIn.length === 0) {
		return null;
	}

	return (
		<AccordionItem
			value="used-in"
			className="bg-background rounded-lg border border-accent"
		>
			<AccordionTrigger className="text-foreground px-4">
				<div className="flex flex-col">
					Used in
					<span className="text-xs text-muted-foreground">
						See what items this material is used to craft.
					</span>
				</div>
			</AccordionTrigger>

			<AccordionContent className="px-2 py-4 text-foreground">
				<UsedInList usedIn={usedIn} />
			</AccordionContent>
		</AccordionItem>
	);
}
