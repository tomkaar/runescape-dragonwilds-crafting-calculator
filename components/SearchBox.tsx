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
import Image from "next/image";
import { createImageUrlPath } from "@/playground/items/utils/image";

const items = itemJSON as Item[];

export function SearchBox() {
  const router = useRouter();

  const handleAddItem = (item: Item | null) => {
    if (item === null) return;
    router.push(`/item/${item.id}`);
  };

  return (
    <Combobox
      items={items}
      filter={fuzzyFilter}
      itemToStringValue={(item: Item) => item.name}
      onValueChange={handleAddItem}
    >
      <ComboboxInput
        showTrigger={false}
        placeholder="Search for an item to craft"
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={createImageUrlPath(item.image)}
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <span>{item.name}</span>
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
