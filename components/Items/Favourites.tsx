"use client";

import { StarIcon } from "lucide-react";
import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { useFavouriteItems } from "@/store/favourite-items";
import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef } from "react";

export function ItemFavourites() {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);
  const favouritedItems = useFavouriteItems((state) => state.items);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.expand();
        panelRef.current.resize(
          contentHeight ? contentHeight + 52 + 20 : "50%",
        );
      } else {
        panelRef.current.collapse();
      }
    }
  };

  return (
    <Panel
      id="favourites"
      panelRef={panelRef}
      minSize={52}
      collapsible
      collapsedSize={52}
      className="bg-neutral-950 rounded-lg"
    >
      <button
        onClick={togglePanel}
        className="cursor-pointer w-full flex flex-row items-center gap-2 px-4 py-4 text-sm"
      >
        <StarIcon className="w-4 h-4 text-neutral-600 fill-neutral-600" />
        Favourites ({favouritedItems.length})
      </button>
      <div className="px-4 pt-2 overflow-scroll h-full pb-15 ">
        <div ref={contentRef}>
          <FavouriteItemsList />
        </div>
      </div>
    </Panel>
  );
}
