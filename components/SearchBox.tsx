"use client";

import { matchSorter } from "match-sorter";

import {
  Combobox,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxContent,
} from "./ui/combobox";

import { Item } from "@/Types";
import itemJSON from "@/data/items.json";
import { useRouter } from "next/navigation";
import { useFavouriteItems } from "@/store/favourite-items";
import { StarIcon } from "lucide-react";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useRef } from "react";

const items = itemJSON.sort((a, b) => a.name.localeCompare(b.name)) as Item[];

export function SearchBox() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const favouriteItems = useFavouriteItems((state) => state.items);

  const handleAddItem = (item: Item | null) => {
    if (item === null) return;
    ref.current?.blur();
    router.push(`/item/${item.id}`);
  };

  return (
    <Combobox
      items={items.map((i) => ({ ...i, label: i.name }))}
      filter={fuzzyFilter}
      itemToStringValue={(item: Item) => item.name}
      onValueChange={handleAddItem}
    >
      <ComboboxInput
        showTrigger
        placeholder="Search for an item to craft"
        ref={ref}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item.id}
              value={item}
              className="cursor-pointer py-1"
            >
              <div className="flex flex-row gap-2 items-center">
                <img
                  src={createImageUrlPath(item.image)}
                  alt={item.name}
                  width={28}
                  height={28}
                />
                <div className="grow">{item.name}</div>

                {favouriteItems.includes(item.id) ? (
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-auto" />
                ) : (
                  <StarIcon className="w-4 h-4 text-neutral-400 ml-auto" />
                )}
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function fuzzyFilter(item: Item, query: string): boolean {
  if (!query) return true;

  const results = matchSorter([item], query, {
    keys: ["name"],
  });

  return results.length > 0;
}
