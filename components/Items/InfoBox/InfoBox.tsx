import { ArrowUpRight } from "lucide-react";

import { Item } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import Link from "next/link";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { Favourite } from "./Favourite";
import { CraftingFacilitiesPopover } from "./CraftingFacilitiesPopover";
import { UnlockedBy } from "./UnlockedBy";
import { Badge } from "../../ui/badge";
import { resolveCraftingTree } from "@/components/CraftingTree/resolve";

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
  const { nodes } = resolveCraftingTree({ itemId });
  const treeFacilities = nodes
    .filter((node) => !node.data.initialNode && node.data.facility)
    .map((node) => node.data.facility as string);
  const extraFacilities = Array.from(
    new Set(
      treeFacilities.filter((f) => !uniqueFacilities.includes(f as never)),
    ),
  );

  return (
    <div className="px-4 py-4 border-b border-neutral-700">
      <div className="flex flex-row gap-4 items-center">
        <div className="grow flex flex-row items-center gap-2">
          {item.image && (
            <img
              src={createImageUrlPath(item.image, 64)}
              alt={item.name}
              width={40}
              height={40}
            />
          )}
          <h2 className="font-bold">{item.name}</h2>
        </div>
        <Favourite itemId={itemId} />
      </div>

      {item.wikiLink || uniqueFacilities.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2 mt-2">
          {item.wikiLink && (
            <Badge asChild variant="secondary" className="text-sm">
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

          {uniqueFacilities &&
            uniqueFacilities.map(
              (facility) =>
                facility && (
                  <Link
                    key={facility}
                    href={{
                      pathname: `/item`,
                      search: `?facility=${encodeURIComponent(facility)}`,
                    }}
                  >
                    <Badge variant="secondary" className="text-sm">
                      {getFacilityIcon(facility, 22)}
                      {facility}
                    </Badge>
                  </Link>
                ),
            )}

          <CraftingFacilitiesPopover facilities={extraFacilities} />
        </div>
      ) : null}

      <UnlockedBy usesRecipes={usesRecipes} />
    </div>
  );
}
