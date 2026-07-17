import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import { resolveUniqueFacilitiesFromItemTree } from "@/domain/crafting/utils/resolve-unique-facilities-from-item-tree";
import { ItemAttributeBadges } from "@/features/item-detail/components/item-attribute-badges";
import { ItemHeader } from "@/features/item-detail/components/item-header";
import { ItemQuickView } from "@/features/item-detail/components/item-quick-view";
import { MultiplierInput } from "@/features/material-tree/components/multiplier-input";
import { RequiredMaterialsContent } from "@/features/material-tree/components/required-materials-content";
import { UsedInList } from "@/features/used-in/components/used-in-list";
import { getUsedIn } from "@/features/used-in/utils/get-used-in";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { sourceItemById } from "@/utils/source-item-by-id";

type Props = {
	params: Promise<{ itemId: string }>;
};

export default async function InterceptedItemModal(props: Props) {
	const { itemId } = await props.params;

	const item = sourceItemById(itemId);

	if (item === undefined) {
		notFound();
	}

	const usedIn = getUsedIn(itemId);
	const itemTree = resolveItemTree(itemId);
	const uniqueFacilities = resolveUniqueFacilitiesFromItemTree(itemTree);
	const usesRecipes = Array.from(
		new Set(item.variants.flatMap((v) => v.usesRecipe ?? [])),
	);

	return (
		<ItemQuickView itemName={item.name}>
			<div>
				<ItemHeader item={item} itemId={itemId} />

				<div className="flex flex-row flex-wrap gap-2 mt-2">
					<ItemAttributeBadges
						item={item}
						afterWiki={
							<Badge asChild variant="outline" className="text-sm">
								<a href={`/item/${itemId}`}>View full crafting tree</a>
							</Badge>
						}
					/>
				</div>
			</div>

			{uniqueFacilities.length > 0 && (
				<div className="mt-2">
					<h3 className="text-sm font-semibold text-foreground">
						Required Facilities
					</h3>
					<span className="block mt-0.5 mb-4 text-xs text-foreground">
						To craft this item, you must first unlock the following facilities
					</span>

					{uniqueFacilities.map((facility) => (
						<Link
							key={facility}
							prefetch={false}
							href={{
								pathname: `/item`,
								search: `?facility=${encodeURIComponent(facility as string)}`,
							}}
						>
							<Badge variant="outline" className="text-sm">
								{getFacilityIcon(facility as (typeof Facility)[number], 22)}
								{facility}
							</Badge>
						</Link>
					))}
				</div>
			)}

			{usesRecipes.length > 0 && (
				<div>
					<h3 className="text-sm font-semibold text-foreground">Unlocked by</h3>
					<span className="block mt-0.5 text-xs text-foreground">
						To craft this item, you must first unlock it by crafting the
						following recipes
					</span>
					<div className="mt-4">
						{usesRecipes.map((recipeName) => (
							<Badge key={recipeName} variant="outline" className="text-sm">
								{recipeName}
							</Badge>
						))}
					</div>
				</div>
			)}

			<div>
				<h3 className="text-sm font-semibold text-foreground">Multiplier</h3>
				<span className="block mt-0.5 text-xs text-foreground">
					How many of this item are needed for each craft
				</span>
				<div className="mt-4">
					<MultiplierInput itemId={itemId} />
				</div>
			</div>

			<h3 className="text-sm font-semibold text-foreground">Materials</h3>
			<RequiredMaterialsContent itemId={itemId} skipFirstLayer />
			{usedIn.length > 0 && (
				<div className="flex flex-col gap-2">
					<h3 className="text-sm font-semibold text-foreground">Used in</h3>
					<UsedInList usedIn={usedIn} />
				</div>
			)}
		</ItemQuickView>
	);
}
