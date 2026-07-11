import { sourceItemById } from "@/utils/source-item-by-id";
import { getUsedIn } from "@/utils/getUsedIn";
import { notFound } from "next/navigation";

import { ItemQuickView } from "@/components/Items/QuickView/ItemQuickView";
import { UsedInList } from "@/components/Items/UsedIn/UsedInList";
import { RequiredMaterialsContent } from "@/components/Items/Materials/components/Tree";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import { resolveUniqueFacilitiesFromItemTree } from "@/domain/crafting/utils/resolve-unique-facilities-from-item-tree";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { Favourite } from "@/components/Items/InfoBox/Favourite";
import { ArrowUpRight } from "lucide-react";
import { WeightBadge } from "@/components/Items/InfoBox/WeightBadge";
import { HealthBadge } from "@/components/Items/InfoBox/HealthBadge";
import { StackLimitBadge } from "@/components/Items/InfoBox/StackLimitBadge";
import { MultiplierInput } from "@/components/Items/MultiplierInput";


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

  return (
    <ItemQuickView itemId={itemId} itemName={item.name}>
      <div>
        <div className="flex flex-row gap-4 items-center pr-2">
          <div className="flex flex-row items-center gap-2">
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

        <div className="flex flex-row flex-wrap gap-2 mt-2">
          {item.wikiLink && (
            <Badge asChild variant="outline" className="text-sm">
              <Link
                href={{
                  pathname:
                    "https://dragonwilds.runescape.wiki/w/" + item.wikiLink,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Wiki
                <ArrowUpRight width={12} height={12} data-icon="inline-end" />
              </Link>
            </Badge>
          )}
          <Badge asChild variant="outline" className="text-sm">
            <a
              href={`/item/${itemId}`}
            >
              View full crafting tree
            </a>
          </Badge>

          <WeightBadge weight={item.weight} />
          <HealthBadge health={item.health} />
          <StackLimitBadge stackLimit={item.stackLimit} />
        </div>

        {uniqueFacilities.length > 0 && (
          <div className="mt-2">
            {uniqueFacilities.map((facility) => (
              <Link
                key={facility}
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
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Multiplier</h3>
        <span className="relative -mt-2 text-xs text-foreground">How many of this item are needed for each craft</span>
        <div className="mt-1"><MultiplierInput itemId={itemId} /></div>
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
