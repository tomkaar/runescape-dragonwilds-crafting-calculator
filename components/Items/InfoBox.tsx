"use client";

import { StarIcon } from "lucide-react";

import { useFavouriteItems } from "@/store/favourite-items";
import { Item } from "@/Types";
import Image from "next/image";
import { createImageUrlPath } from "@/playground/items/utils/image";

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

  return (
    <div>
      <div className="flex flex-row gap-4 items-center">
        <button onClick={toggleFavourite} className="cursor-pointer">
          {isFavourited ? (
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ) : (
            <StarIcon className="w-5 h-5 text-neutral-600" />
          )}
        </button>
        <div className="flex flex-row items-center">
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
      </div>
    </div>
  );
}
