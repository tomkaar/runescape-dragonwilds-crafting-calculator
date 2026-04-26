"use client";

import { useState } from "react";
import { ChevronDown, Ellipsis, ArrowRight, ExternalLink } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type MaterialTreeItem } from "../utils/buildMaterialsTree";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { CheckboxIndeterminate } from "@/components/ui/checkbox";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCraftingTreeHover } from "@/context/crafting-tree-hover";

function TreeNodeNavigateMenu({
  itemId,
  wikiLink,
}: {
  itemId: string;
  wikiLink?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Ellipsis className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem asChild>
          <a href={`/item/${itemId}`}>
            <ArrowRight className="size-4" />
            View item
          </a>
        </DropdownMenuItem>
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

function hasCheckedDescendant(
  node: MaterialTreeItem,
  items: Array<{ nodeId?: string }>,
): boolean {
  if (!("children" in node) || node.children.length === 0) return false;
  return node.children.some(
    (child) =>
      items.some((i) => i.nodeId === child.nodeId) ||
      hasCheckedDescendant(child, items),
  );
}

export function MaterialTreeNode({
  item,
  initialItemId,
  baseQuantities,
}: {
  item: MaterialTreeItem;
  initialItemId: string;
  baseQuantities: Map<string, number>;
}) {
  const { enter, reset } = useCraftingTreeHover();
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.find(
    (selectedItem) => selectedItem.nodeId === item.nodeId,
  );

  const anyDescendantChecked = hasCheckedDescendant(item, items);

  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const markAsDone = useSelectedMaterial((state) => state.markAsDone);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );
  const [manualOpen, setManualOpen] = useState(
    item.nodeId === initialItemId || anyDescendantChecked,
  );

  const handleToggleItem = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
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
      quantity: baseQuantities.get(item.nodeId) ?? item.quantity,
      nodeId: item.nodeId,
      nodeOriginalId: initialItemId,
      state: "TODO",
    });
  };

  const checkboxId = `material-checkbox-${item.nodeId}`;
  const checkboxState =
    added?.state === "DONE"
      ? true
      : added?.state === "TODO"
        ? "indeterminate"
        : false;

  if ("children" in item && item.children.length > 0) {
    return (
      <Collapsible
        key={item.nodeId}
        open={manualOpen || anyDescendantChecked}
        onOpenChange={setManualOpen}
      >
        <div className="flex flex-row gap-2 items-center">
          {item.variantNumber === undefined && (
            <CheckboxIndeterminate
              onClick={handleToggleItem}
              checked={checkboxState}
            />
          )}

          <CollapsibleTrigger className="flex-1">
            <div
              className={cn(
                "flex flex-row gap-2 items-center pr-2 pl-2 py-0.5 rounded-lg text-sm group hover:bg-accent w-full justify-start transition-none",
                item.variantNumber !== undefined ? "pl-2 py-0.5" : "",
              )}
              onMouseEnter={() => enter(item.nodeId)}
              onMouseLeave={() => reset()}
              onFocus={() => enter(item.nodeId)}
              onBlur={() => reset()}
            >
              {item.item.image && item.variantNumber === undefined && (
                <img
                  src={createImageUrlPath(item.item.image)}
                  alt={item.item.name}
                  width={24}
                  height={24}
                />
              )}
              {item.variantNumber === undefined && (
                <span className="font-semibold text-foreground">
                  {item.quantity}x
                </span>
              )}
              {item.variantNumber === undefined && (
                <span className="text-left">{item.item.name}</span>
              )}
              {item.variantNumber !== undefined && (
                <span className="text-title">Recipe {item.variantNumber}</span>
              )}

              <ChevronDown className="w-4 h-4 self-center justify-self-end ml-auto text-muted-foreground group-hover:text-foreground" />
            </div>
          </CollapsibleTrigger>
          {item.variantNumber === undefined && (
            <TreeNodeNavigateMenu
              itemId={item.id}
              wikiLink={item.item.wikiLink}
            />
          )}
        </div>

        <div className="pl-2">
          <CollapsibleContent
            className={cn(
              "border-l border-border pl-2",
              item.variantNumber !== undefined && "border-title ml-2",
            )}
          >
            <div className="flex flex-col pl-2">
              {item.children.map((child) => (
                <MaterialTreeNode
                  key={child.nodeId}
                  item={child}
                  initialItemId={initialItemId}
                  baseQuantities={baseQuantities}
                />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <FieldGroup key={item.nodeId} className="w-full">
      <div
        role="group"
        data-slot="field"
        data-orientation="horizontal"
        className="flex flex-row gap-2 items-center"
      >
        <CheckboxIndeterminate
          id={checkboxId}
          checked={checkboxState}
          onCheckedChange={() => handleToggleItem()}
        />
        <FieldContent>
          <FieldLabel
            htmlFor={checkboxId}
            className="flex flex-row gap-2 items-center px-2 py-1 rounded-lg text-sm text-foreground w-full justify-start transition-colors hover:bg-accent hover:text-accent-foreground"
            onMouseEnter={() => enter(item.nodeId)}
            onMouseLeave={() => reset()}
            onFocus={() => enter(item.nodeId)}
            onBlur={() => reset()}
          >
            {item.item.image && (
              <img
                src={createImageUrlPath(item.item.image)}
                alt={item.item.name}
                width={24}
                height={24}
              />
            )}
            <span className="font-semibold">{item.quantity}x</span>
            <span className="text-left">{item.item.name}</span>
            {item.variantNumber && (
              <span className="text-muted-foreground">
                (Recipe {item.variantNumber})
              </span>
            )}
          </FieldLabel>
        </FieldContent>
        <TreeNodeNavigateMenu itemId={item.id} wikiLink={item.item.wikiLink} />
      </div>
    </FieldGroup>
  );
}
