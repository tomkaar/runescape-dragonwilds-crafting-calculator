"use client";

import { StarIcon } from "lucide-react";

import { FavouriteItemsList } from "@/components/FavouriteItemsList";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSettings } from "@/store/settings";

export function ItemFavourites() {
  const isOpen = useSettings((state) => state.UIItemFavouritesOpen);
  const toggle = useSettings((state) => state.toggleUIItemFavouritesOpen);

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? "item-1" : ""}
      onValueChange={toggle}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-4 cursor-pointer">
          <div className="flex flex-row items-center gap-2">
            <StarIcon className="w-4 h-4 text-neutral-600 fill-neutral-600" />
            Favourites
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 max-h-40 overflow-y-auto">
          <FavouriteItemsList />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
