"use client";
import { StarIcon } from "lucide-react";

import { useFavouriteItems } from "@/store/favourite-items";
import { getItemByNameOrId } from "@/utils/getItemById";
import Link from "next/link";

type Props = {
  displayStar?: boolean;
};

export function FavouriteItemsList(props: Props) {
  const favouritedItems = useFavouriteItems((state) => state.items);

  const resolvedItems = favouritedItems
    .map((itemId) => getItemByNameOrId(itemId))
    .filter((item) => item !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {favouritedItems.length > 0 && (
        <ul className="flex flex-row gap-2 flex-wrap">
          {resolvedItems.map((item) => (
            <FavouriteItem
              key={item.id}
              id={item.id}
              name={item.name}
              displayStar={props.displayStar}
            />
          ))}
        </ul>
      )}
    </>
  );
}

type FavouriteItemProps = {
  id: string;
  name: string;
  displayStar?: boolean;
};
function FavouriteItem({ id, name, displayStar }: FavouriteItemProps) {
  return (
    <li>
      <Link
        href={{ pathname: `/item/${id}` }}
        className="bg-neutral-800 rounded-lg px-3 py-1 flex flex-row gap-1 items-center"
      >
        {displayStar && (
          <StarIcon className="w-4 h-4 text-neutral-600 fill-neutral-600" />
        )}
        {name}
      </Link>
    </li>
  );
}
