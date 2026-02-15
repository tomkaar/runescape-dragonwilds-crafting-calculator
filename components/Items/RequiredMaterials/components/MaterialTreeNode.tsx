"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type MaterialTreeItem } from "../utils/buildMaterialsTree";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { CheckboxIndeterminate } from "@/components/ui/checkbox";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";

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
      quantity: item.quantity,
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
        defaultOpen={item.nodeId === initialItemId}
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
                "cursor-pointer flex flex-row gap-2 items-center pr-2 pl-2 py-0.5 rounded-lg text-sm group hover:bg-accent w-full justify-start transition-none",
                item.variantNumber !== undefined ? "pl-2 py-0.5" : "",
              )}
            >
              {item.item.image && item.variantNumber === undefined && (
                <img
                  src={createImageUrlPath(item.item.image)}
                  alt={item.item.name}
                  width={28}
                  height={28}
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

        <div className="pl-2">
          <CollapsibleContent className="mt-1 border-l border-neutral-400 pl-2">
            <div className="flex flex-col gap-1 pl-2">
              {item.children.map((child) => (
                <MaterialTreeNode
                  key={child.nodeId}
                  item={child}
                  initialItemId={initialItemId}
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
            className="cursor-pointer flex flex-row gap-2 items-center px-2 py-1 rounded-lg text-sm text-foreground w-full justify-start transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.item.image && (
              <img
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
          </FieldLabel>
        </FieldContent>
      </div>
    </FieldGroup>
  );
}
