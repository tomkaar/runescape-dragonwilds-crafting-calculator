import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { Item } from "@/Types";
import type { MerchantTrades } from "../types/merchant-trades";
import { getMerchantTrades } from "../utils/get-merchant-trades";
import { MerchantTradeList } from "./merchant-trade-list";

const titles: Record<keyof MerchantTrades, string> = {
	buy: "Buy",
	sell: "Sell",
};

export function merchantTradesDescription(
	direction: keyof MerchantTrades,
	currencyName: string,
) {
	return direction === "buy"
		? `Buy these items from merchants for ${currencyName}`
		: `Sell these items to merchants for ${currencyName}`;
}

type Props = {
	item: Item;
	direction: keyof MerchantTrades;
};

export function AccordionMerchantTrades({ item, direction }: Props) {
	const groups = getMerchantTrades(item.id)[direction];

	if (groups.length === 0) {
		return null;
	}

	return (
		<AccordionItem
			value={`merchant-trades-${direction}`}
			className="bg-background rounded-lg border border-accent"
		>
			<AccordionTrigger className="text-foreground px-4">
				<div className="flex flex-col">
					{titles[direction]}
					<span className="text-xs text-muted-foreground">
						{merchantTradesDescription(direction, item.name)}
					</span>
				</div>
			</AccordionTrigger>

			<AccordionContent className="px-2 py-4 text-foreground">
				<MerchantTradeList groups={groups} currency={item} />
			</AccordionContent>
		</AccordionItem>
	);
}
