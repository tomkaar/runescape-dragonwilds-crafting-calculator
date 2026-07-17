import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import { resolveUniqueFacilitiesFromItemTree } from "@/domain/crafting/utils/resolve-unique-facilities-from-item-tree";
import type { Item } from "@/Types";
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

	const uniqueFacilities = Array.from(new Set(item.facilities));

	const usesRecipes = Array.from(
		new Set(item.variants.flatMap((v) => v.usesRecipe ?? [])),
	);

	// Collect all facilities from the crafting tree (sub-materials only)
	const itemTree = resolveItemTree(itemId);
	const treeFacilities = resolveUniqueFacilitiesFromItemTree(itemTree);
	const extraFacilities = treeFacilities.filter(
		(f) => !uniqueFacilities.includes(f as never),
	);

	return (
		<div className="p-2">
			<ItemHeader item={item} itemId={itemId} />

			<div className="flex flex-row flex-wrap gap-2 mt-2">
				<ItemAttributeBadges item={item} />
			</div>

			<div className="flex flex-row flex-wrap gap-2 mt-2 items-center">
				{uniqueFacilities?.map(
					(facility) =>
						facility && (
							<Link
								key={facility}
								prefetch={false}
								href={{
									pathname: `/item`,
									search: `?facilities=${encodeURIComponent(facility)}`,
								}}
							>
								<Badge variant="outline" className="text-sm">
									{getFacilityIcon(facility, 22)}
									{facility}
								</Badge>
							</Link>
						),
				)}

				<CraftingFacilitiesPopover facilities={extraFacilities} />
			</div>

			<UnlockedBy usesRecipes={usesRecipes} />
		</div>
	);
}
