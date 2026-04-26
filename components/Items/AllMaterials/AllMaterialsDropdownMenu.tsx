"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  Circle,
  CircleCheckBig,
  Trash2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";

type AllMaterialsDropdownMenuProps = {
  recipeId: string;
  nodeId: string;
};

export function AllMaterialsDropdownMenu({
  recipeId,
  nodeId,
}: AllMaterialsDropdownMenuProps) {
  const recipeItems = useSelectedMaterial(
    (state) => state.items[recipeId] ?? [],
  );
  const markAsDoneByNodeId = useSelectedMaterial(
    (state) => state.markAsDoneByNodeId,
  );
  const markAsTodoByNodeId = useSelectedMaterial(
    (state) => state.markAsTodoByNodeId,
  );
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const added = recipeItems.find((item) => item.nodeId === nodeId);
  const material = getItemById(recipeId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Ellipsis className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuLabel>Check</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => markAsTodoByNodeId(recipeId, nodeId)}
          disabled={added?.state === "TODO"}
        >
          <Circle className="size-4" />
          Mark as Todo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => markAsDoneByNodeId(recipeId, nodeId)}
          disabled={added?.state === "DONE"}
        >
          <CircleCheckBig className="size-4" />
          Mark as Done
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => removeAnItemByNodeId(recipeId, nodeId)}
          disabled={!added}
        >
          <Trash2 className="size-4" />
          Remove
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Navigate</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href={`/item/${recipeId}`}>
            <ArrowRight className="size-4" />
            View item
          </a>
        </DropdownMenuItem>
        {material?.wikiLink && (
          <DropdownMenuItem asChild>
            <a
              href={`https://dragonwilds.runescape.wiki/w/${encodeURIComponent(material.wikiLink)}`}
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

export function MaterialNavigateMenu({ materialId }: { materialId: string }) {
  const material = getItemById(materialId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Ellipsis className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem asChild>
          <a href={`/item/${materialId}`}>
            <ArrowRight className="size-4" />
            View item
          </a>
        </DropdownMenuItem>
        {material?.wikiLink && (
          <DropdownMenuItem asChild>
            <a
              href={`https://dragonwilds.runescape.wiki/w/${encodeURIComponent(material.wikiLink)}`}
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
