import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { idFromName } from "@/scripts/parse-data/utils/id-from-name";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { Store } from "@/Types";
import { sourceItemById } from "@/utils/source-item-by-id";
import { groupStoresByCurrency } from "../utils/group-stores-by-currency";

type Props = {
	icon: LucideIcon;
	title: string;
	stores: Store[] | undefined;
};

export function StoreBadge({ icon: Icon, title, stores }: Props) {
	if (!stores?.length) return null;

	return groupStoresByCurrency(stores).map(({ currency, min, max, stores }) => {
		const currencyImage = sourceItemById(idFromName(currency))?.image;
		const label = min === max ? `${min}` : `${min}-${max}`;

		return (
			<TooltipProvider key={currency}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge variant="secondary" className="text-sm cursor-default">
							<Icon size={20} /> {label}
							{currencyImage ? (
								<img
									src={createImageUrlPath(currencyImage, 32)}
									alt={currency}
									width={20}
									height={20}
									className="shrink-0"
								/>
							) : (
								` ${currency}`
							)}
						</Badge>
					</TooltipTrigger>
					<TooltipContent className="max-w-84">
						<span className="font-semibold">{title}</span>
						{stores.map((store) => (
							<span key={store.name}>
								<br />
								{store.name} — {store.cost} {store.currency}
							</span>
						))}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	});
}
