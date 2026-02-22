"use client";

import { StarIcon } from "lucide-react";
import { useFavouriteItems } from "@/store/favourite-items";

type Props = {
  itemId: string;
};

export function Favourite(props: Props) {
  const { itemId } = props;
  const favouritedItems = useFavouriteItems((state) => state.items);
  const toggleAnItem = useFavouriteItems((state) => state.toggleAnItem);
  const isFavourited = favouritedItems.includes(itemId);

  const toggleFavourite = () => {
    toggleAnItem(itemId);
  };

  return (
    <button onClick={toggleFavourite} className="cursor-pointer">
      {isFavourited ? (
        <StarIcon className="w-5 h-5 text-title fill-title" />
      ) : (
        <StarIcon className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
}
