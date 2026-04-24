"use client";

import { matchSorter } from "match-sorter";
import { useVirtualizer } from "@tanstack/react-virtual";

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
import { useEffect, useMemo, useRef, useState } from "react";

const items = itemJSON.sort((a, b) => a.name.localeCompare(b.name)) as Item[];

export function SearchBox() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const favouriteItems = useFavouriteItems((state) => state.items);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    return matchSorter(items, query, { keys: ["name"] });
  }, [query]);

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 40,
    overscan: 8,
  });

  // Measure the virtualizer when the dropdown opens to ensure correct item sizes
  // without this, the virtualizer may not calculate sizes correctly until the user interacts with the list
  // resulting in displaying a blank list
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => rowVirtualizer.measure());
    return () => cancelAnimationFrame(id);
  }, [open, rowVirtualizer]);

  const handleAddItem = (item: Item | null) => {
    if (item === null) return;
    ref.current?.blur();
    router.push(`/item/${item.id}`);
  };

  return (
    <Combobox
      items={items.map((i) => ({ ...i, label: i.name }))}
      filteredItems={filteredItems}
      virtualized
      open={open}
      onOpenChange={setOpen}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringValue={(item: Item) => item.name}
      onValueChange={handleAddItem}
      onItemHighlighted={(_, details) => {
        rowVirtualizer.scrollToIndex(details.index, { align: "auto" });
      }}
    >
      <ComboboxInput
        showTrigger
        placeholder="Search for an item to craft"
        ref={ref}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList ref={listRef}>
          <div
            className="relative w-full"
            style={{ height: rowVirtualizer.getTotalSize() }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = filteredItems[virtualItem.index];
              if (!item) return null;

              return (
                <ComboboxItem
                  key={item.id}
                  index={virtualItem.index}
                  value={item}
                  className="absolute left-0 top-0 w-full cursor-pointer py-1"
                  style={{
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {item.image && (
                      <img
                        src={createImageUrlPath(item.image)}
                        alt={item.name}
                        width={28}
                        height={28}
                      />
                    )}
                    <div className="grow">{item.name}</div>

                    {favouriteItems.includes(item.id) ? (
                      <StarIcon className="w-4 h-4 text-title fill-title ml-auto" />
                    ) : (
                      <StarIcon className="w-4 h-4 text-muted-foreground ml-auto" />
                    )}
                  </div>
                </ComboboxItem>
              );
            })}
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
