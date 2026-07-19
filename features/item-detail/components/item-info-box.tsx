import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { resolveFacilityRequirements } from "@/domain/crafting/utils/resolve-facility-requirements";
import type { Facility, Item } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { CraftingFacilitiesPopover } from "./crafting-facilities-popover";
import { ItemAttributeBadges } from "./item-attribute-badges";
import { ItemHeader } from "./item-header";
import { UnlockedBy } from "./unlocked-by";

type Props = {
	item: Item;
	itemId: string;
};

export function ItemInfoBox(props: Props) {
	const { item, itemId } = props;

	const { ownFacilities, additionalFacilities } = resolveFacilityRequirements(
		item,
		itemId,
	);

	const usesRecipes = Array.from(
		new Set(item.variants.flatMap((v) => v.usesRecipe ?? [])),
	);

	return (
		<div className="p-2">
			<ItemHeader item={item} itemId={itemId} />

			<div className="flex flex-row flex-wrap gap-2 mt-2">
				<ItemAttributeBadges item={item} />
			</div>

			<div className="flex flex-row flex-wrap gap-2 mt-2 items-center">
				{ownFacilities.map((facility) => (
					<Link
						key={facility}
						prefetch={false}
						href={{
							pathname: `/item`,
							search: `?facilities=${encodeURIComponent(facility)}`,
						}}
					>
						<Badge variant="outline" className="text-sm">
							{getFacilityIcon(facility as (typeof Facility)[number], 22)}
							{facility}
						</Badge>
					</Link>
				))}

				<CraftingFacilitiesPopover facilities={additionalFacilities} />
			</div>

			<UnlockedBy usesRecipes={usesRecipes} />
		</div>
	);
}
