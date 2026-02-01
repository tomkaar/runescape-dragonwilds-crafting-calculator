"use client";

import { StarIcon } from "lucide-react";

import { useFavouriteItems } from "@/store/favourite-items";
import { Item } from "@/Types";

type Props = {
  item: Item;
  itemId: string;
};

export function InfoBox(props: Props) {
  const { item, itemId } = props;
  const favouritedItems = useFavouriteItems((state) => state.items);
  const toggleAnItem = useFavouriteItems((state) => state.toggleAnItem);
  const isFavourited = favouritedItems.includes(itemId);

  const toggleFavourite = () => {
    toggleAnItem(item.id);
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <button onClick={toggleFavourite} className="cursor-pointer">
          {isFavourited ? (
            <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          ) : (
            <StarIcon className="w-6 h-6 text-neutral-600" />
          )}
        </button>
        <h2>{item.name}</h2>
      </div>
    </div>
  );
}
