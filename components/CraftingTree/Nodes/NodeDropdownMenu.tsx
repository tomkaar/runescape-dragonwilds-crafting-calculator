"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Plus, ExternalLink, ArrowRight } from "lucide-react";
import { useSelectedMaterial } from "@/store/selected-material";
import itemsData from "@/data/items.json";
import type { Item } from "@/Types";

type NodeDropdownMenuProps = {
  id: string;
  nodeId: string;
  initialItemId: string;
  quantity: number;
};

export function NodeDropdownMenu({
  id,
  nodeId,
  initialItemId,
  quantity,
}: NodeDropdownMenuProps) {
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.find((item) => item.nodeId === nodeId);
  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const item = itemsData.find(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  ) as Item | undefined;
  const wikiLink = item?.wikiLink;

  const handleAddToTracking = () => {
    if (added) return;
    addAnItem(initialItemId, {
      id: self.crypto.randomUUID(),
      itemId: id,
      quantity,
      nodeId,
      nodeOriginalId: initialItemId,
      state: "TODO",
    });
  };

  const handleClearState = () => {
    if (added) {
      removeAnItemByNodeId(initialItemId, nodeId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Ellipsis className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuLabel>Check</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleAddToTracking} disabled={!!added}>
          <Plus className="size-4" />
          Add to tracking
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearState} disabled={!added}>
          <div className="size-4" />
          Clear
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>See more</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href={`/item/${id}`}>
            <ArrowRight className="size-4" />
            View item
          </a>
        </DropdownMenuItem>
        {item?.name && (
          <DropdownMenuItem asChild>
            <a href={`/item?materials=${encodeURIComponent(item.name)}`}>
              <ArrowRight className="size-4" />
              Items using this
            </a>
          </DropdownMenuItem>
        )}
        {wikiLink && (
          <DropdownMenuItem asChild>
            <a
              href={`https://dragonwilds.runescape.wiki/w/${encodeURIComponent(wikiLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-4" />
              View on Wiki
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
