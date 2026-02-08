"use client";

import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type MaterialTreeItem } from "../utils/buildMaterialsTree";
import Image from "next/image";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

export function MaterialTreeNode({
  item,
  initialItemId,
}: {
  item: MaterialTreeItem;
  initialItemId: string;
}) {
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.find(
    (selectedItem) => selectedItem.nodeId === item.nodeId,
  );

  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const markAsDone = useSelectedMaterial((state) => state.markAsDone);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const handleToggleItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (added) {
      if (added.state === "TODO") {
        markAsDone(initialItemId, added.id);
        return;
      }
      removeAnItemByNodeId(initialItemId, item.nodeId);
      return;
    }
    addAnItem(initialItemId, {
      id: self.crypto.randomUUID(),
      itemId: item.id,
      quantity: item.quantity,
      nodeId: item.nodeId,
      nodeOriginalId: initialItemId,
      state: "TODO",
    });
  };

  if ("children" in item && item.children.length > 0) {
    return (
      <Collapsible
        key={item.nodeId}
        defaultOpen={item.nodeId === initialItemId}
      >
        <div className="flex flex-row items-center">
          {item.variantNumber === undefined && (
            <button
              onClick={handleToggleItem}
              className={`
              cursor-pointer px-2 py-2 rounded-lg text-sm transition-colors ${
                added?.state === "DONE"
                  ? "bg-green-900/50 hover:bg-green-900/70"
                  : added?.state === "TODO"
                    ? "bg-blue-900/50 hover:bg-blue-900/70"
                    : "hover:bg-accent"
              }`}
            >
              {added?.state === "DONE" ? (
                <Check width={16} height={16} />
              ) : added?.state === "TODO" ? (
                <Minus width={16} height={16} />
              ) : (
                <Plus width={16} height={16} />
              )}
            </button>
          )}

          <CollapsibleTrigger className="flex-1">
            <div
              className={cn(
                "cursor-pointer flex flex-row gap-2 items-center pr-2 pl-2 py-2 rounded-lg text-sm group hover:bg-accent w-full justify-start transition-none",
                item.variantNumber !== undefined ? "pl-2 py-0.5" : "",
              )}
            >
              {item.item.image && item.variantNumber === undefined && (
                <Image
                  src={createImageUrlPath(item.item.image)}
                  alt={item.item.name}
                  width={20}
                  height={20}
                />
              )}
              {item.variantNumber === undefined && (
                <span className="font-semibold">{item.quantity}x</span>
              )}
              {item.variantNumber === undefined && (
                <span className="text-left">{item.item.name}</span>
              )}
              {item.variantNumber !== undefined && (
                <span className="text-muted-foreground">
                  Recipe {item.variantNumber}
                </span>
              )}

              <ChevronDown className="w-4 h-4 self-center justify-self-end ml-auto text-neutral-400 group-hover:text-neutral-200" />
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-1 ml-4 border-l border-neutral-700 pl-2">
          <div className="flex flex-col gap-1">
            {item.children.map((child) => (
              <MaterialTreeNode
                key={child.nodeId}
                item={child}
                initialItemId={initialItemId}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <button
      key={item.nodeId}
      onClick={handleToggleItem}
      className={`cursor-pointer flex flex-row gap-2 items-center px-2 py-2 rounded-lg text-sm text-foreground w-full justify-start transition-colors ${
        added?.state === "DONE"
          ? "bg-green-900/50 hover:bg-green-900/70"
          : added?.state === "TODO"
            ? "bg-blue-900/50 hover:bg-blue-900/70"
            : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {added?.state === "DONE" ? (
        <Check width={16} height={16} />
      ) : added?.state === "TODO" ? (
        <Minus width={16} height={16} />
      ) : (
        <Plus width={16} height={16} />
      )}
      {item.item.image && (
        <Image
          src={createImageUrlPath(item.item.image)}
          alt={item.item.name}
          width={20}
          height={20}
        />
      )}
      <span className="font-semibold">{item.quantity}x</span>
      <span className="text-left">{item.item.name}</span>
      {item.variantNumber && (
        <span className="text-muted-foreground">
          (Recipe {item.variantNumber})
        </span>
      )}
    </button>
  );
}
