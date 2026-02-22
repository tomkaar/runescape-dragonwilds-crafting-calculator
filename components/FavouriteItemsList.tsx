"use client";

import { useFavouriteItems } from "@/store/favourite-items";
import { getItemById } from "@/utils/itemById";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import Link from "@/components/link";
import { Badge } from "./ui/badge";

export function FavouriteItemsList() {
  const favouritedItems = useFavouriteItems((state) => state.items);

  const resolvedItems = favouritedItems
    .map((itemId) => getItemById(itemId))
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
              image={item.image}
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
  image: string | null;
};
function FavouriteItem({ id, name, image }: FavouriteItemProps) {
  return (
    <li>
      <Badge asChild variant="secondary" className="text-sm">
        <Link href={{ pathname: `/item/${id}` }}>
          {image && (
            <img
              src={createImageUrlPath(image)}
              width={20}
              height={20}
              alt={name}
            />
          )}
          {name}
        </Link>
      </Badge>
    </li>
  );
}
