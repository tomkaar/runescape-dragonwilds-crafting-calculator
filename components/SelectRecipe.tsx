"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { matchSorter } from "match-sorter";
import Image from "next/image";

import recipes from "@/data/recipes.json";
import { type RecipeGroup } from "@/data/recipes";
import { useSelectedItems } from "@/store/selected-items";

export default function SelectRecipe() {
  // console.log("recipes:", Object.values(recipes));
  const addAnItem = useSelectedItems((state) => state.addAnItem);

  return (
    <Combobox
      items={Object.values(recipes)}
      filter={fuzzyFilter}
      onValueChange={(value) => {
        if (value === null) return;
        addAnItem(value as unknown as string);
      }}
    >
      <ComboboxInput placeholder="Select a item" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item.id}>
              <div className="flex flex-row gap-2">
                {item.image ? (
                  <Image
                    src={item.image}
                    width={24}
                    height={24}
                    alt={item.name}
                  />
                ) : null}

                <div>{item.name} </div>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function fuzzyFilter(item: RecipeGroup, query: string): boolean {
  if (!query) return true;

  const results = matchSorter([item], query, {
    keys: ["name"],
  });

  return results.length > 0;
}
