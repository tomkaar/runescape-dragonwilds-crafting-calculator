"use client";

import { ExternalLinkIcon, StarIcon } from "lucide-react";

import { useFavouriteItems } from "@/store/favourite-items";
import { Item } from "@/Types";
import Image from "next/image";
import getFacilityIcon from "@/utils/getFacilityIcon";
import Link from "next/link";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type Props = {
  item: Item;
  itemId: string;
};

export function ItemInfoBox(props: Props) {
  const { item, itemId } = props;
  const favouritedItems = useFavouriteItems((state) => state.items);
  const toggleAnItem = useFavouriteItems((state) => state.toggleAnItem);
  const isFavourited = favouritedItems.includes(itemId);

  const toggleFavourite = () => {
    toggleAnItem(item.id);
  };

  const unqieFacilities = Array.from(new Set(item.facilities));

  return (
    <div className="px-4 py-4 border-b border-neutral-700">
      <div className="flex flex-row gap-4 items-center">
        <div className="grow flex flex-row items-center">
          {item.image && (
            <Image
              src={createImageUrlPath(item.image)}
              alt={item.name}
              width={40}
              height={40}
            />
          )}
          <h2>{item.name}</h2>
        </div>
        <button onClick={toggleFavourite} className="cursor-pointer">
          {isFavourited ? (
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ) : (
            <StarIcon className="w-5 h-5 text-neutral-600" />
          )}
        </button>
      </div>

      {item.wikiLink || unqieFacilities.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2 mt-2">
          {item.wikiLink && (
            <Link
              prefetch={false}
              href={{
                pathname:
                  "https://dragonwilds.runescape.wiki/w/" + item.wikiLink,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-neutral-800 text-sm rounded-lg pl-2.5 px-2 py-1 flex flex-row gap-1 items-center">
                Wiki
                <ExternalLinkIcon width={12} height={12} className="ml-0.5" />
              </div>
            </Link>
          )}

          {unqieFacilities &&
            unqieFacilities.map(
              (facility) =>
                facility && (
                  <div
                    key={facility}
                    className="bg-neutral-800 text-sm rounded-lg pl-1 pr-3 py-1 flex flex-row gap-1 items-center"
                  >
                    {getFacilityIcon(facility, 20)}
                    {facility}
                  </div>
                ),
            )}
        </div>
      ) : null}
    </div>
  );
}
