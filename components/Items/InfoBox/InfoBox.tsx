import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import { resolveUniqueFacilitiesFromItemTree } from "@/domain/crafting/utils/resolve-unique-facilities-from-item-tree";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { Item } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { Badge } from "../../ui/badge";
import { CraftingFacilitiesPopover } from "./CraftingFacilitiesPopover";
import { Favourite } from "./Favourite";
import { HealthBadge } from "./HealthBadge";
import { StackLimitBadge } from "./StackLimitBadge";
import { UnlockedBy } from "./UnlockedBy";
import { WeightBadge } from "./WeightBadge";

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
			<div className="flex flex-row gap-4 items-center pr-2">
				<div className="grow flex flex-row items-center gap-2">
					{item.image && (
						<img
							src={createImageUrlPath(item.image, 64)}
							alt={item.name}
							width={40}
							height={40}
						/>
					)}
					<h2 className="text-white font-bold">{item.name}</h2>
				</div>
				<Favourite itemId={itemId} />
			</div>

			{item.wikiLink ||
			uniqueFacilities.length > 0 ||
			item.weight != null ||
			item.health != null ||
			item.stackLimit != null ? (
				<div className="flex flex-row flex-wrap gap-2 mt-2">
					{item.wikiLink && (
						<Badge asChild variant="outline" className="text-sm">
							<Link
								href={{
									pathname: `https://dragonwilds.runescape.wiki/w/${item.wikiLink}`,
								}}
								target="_blank"
								rel="noopener noreferrer"
							>
								Wiki
								<ArrowUpRight width={12} height={12} data-icon="inline-end" />
							</Link>
						</Badge>
					)}

					<WeightBadge weight={item.weight} />
					<HealthBadge health={item.health} />
					<StackLimitBadge stackLimit={item.stackLimit} />
				</div>
			) : null}

			<div className="flex flex-row flex-wrap gap-2 mt-2 items-center">
				{uniqueFacilities?.map(
					(facility) =>
						facility && (
							<Link
								key={facility}
								href={{
									pathname: `/item`,
									search: `?facility=${encodeURIComponent(facility)}`,
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
