"use client";

import { Check, CirclePile, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSettings } from "@/store/settings";
import { resolveCraftingTree } from "../CraftingTree/resolveCraftingTree";
import {
  buildMaterialsTree,
  type MaterialTreeItem,
} from "./buildMaterialsTree";
import Image from "next/image";
import { createImageUrlPath } from "@/playground/items/utils/image";
import { useSelectedMaterial } from "@/store/selected-material";

type Props = {
  itemId: string;
};

export function RequiredMaterials(props: Props) {
  const isOpen = useSettings((state) => state.UIItemRequiredMaterials);
  const toggle = useSettings((state) => state.toggleUIItemRequiredMaterials);

  const treeData = resolveCraftingTree(props.itemId, props.itemId, 1);
  const tree = treeData
    ? buildMaterialsTree(treeData.nodes, treeData.edges)
    : [];

  // Skip the first layer (root node) and render its children
  const materialsToRender =
    tree.length > 0 && "children" in tree[0] ? tree[0].children : [];

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
            <CirclePile className="w-4 h-4 text-neutral-600 fill-neutral-600" />
            Required Materials
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 max-h-80 overflow-y-auto">
          <div className="flex flex-col gap-1 w-full">
            {materialsToRender.map((item) => (
              <MaterialTreeNode
                key={item.nodeId}
                item={item}
                initialItemId={props.itemId}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function MaterialTreeNode({
  item,
  initialItemId,
}: {
  item: MaterialTreeItem;
  initialItemId: string;
}) {
  const i = useSelectedMaterial((state) => state.items);
  const items = i[initialItemId] || [];
  const added = items.some(
    (selectedItem) => selectedItem.nodeId === item.nodeId,
  );

  const addAnItem = useSelectedMaterial((state) => state.addAnItem);
  const removeAnItemByNodeId = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );

  const handleToggleItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (added) {
      removeAnItemByNodeId(initialItemId, item.nodeId);
      return;
    }
    addAnItem(initialItemId, {
      id: self.crypto.randomUUID(),
      itemId: item.id,
      quantity: item.quantity,
      nodeId: item.nodeId,
      nodeOriginalId: initialItemId,
    });
  };

  if ("children" in item && item.children.length > 0) {
    return (
      <Collapsible
        key={item.nodeId}
        className="hover:bg-white/5 hover:rounded-lg"
      >
        <div className="flex flex-row items-center gap-1">
          <button
            onClick={handleToggleItem}
            className={`
              cursor-pointer px-2 py-2 rounded-lg text-sm transition-colors ${
                added
                  ? "bg-green-900/50 hover:bg-green-900/70"
                  : "hover:bg-accent"
              }`}
          >
            {added ? (
              <Check width={16} height={16} />
            ) : (
              <Plus width={16} height={16} />
            )}
          </button>
          <CollapsibleTrigger className="flex-1">
            <div className="cursor-pointer inline-flex flex-row gap-2 px-2 py-2 rounded-lg text-sm group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none">
              {item.item.image && (
                <Image
                  src={createImageUrlPath(item.item.image)}
                  alt={item.item.name}
                  width={20}
                  height={20}
                />
              )}
              <span className="font-semibold">{item.quantity}x</span>
              <span>{item.item.name}</span>
              {item.variantNumber !== undefined && (
                <span className="text-muted-foreground">
                  (Recipe {item.variantNumber})
                </span>
              )}
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-1 ml-5">
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
      className={`cursor-pointer inline-flex flex-row gap-2 px-2 py-2 rounded-lg text-sm text-foreground w-full justify-start transition-colors ${
        added
          ? "bg-green-900/50 hover:bg-green-900/70"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {added ? (
        <Check width={16} height={16} />
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
      <span>{item.item.name}</span>
      {item.variantNumber && (
        <span className="text-muted-foreground">
          (Recipe {item.variantNumber})
        </span>
      )}
    </button>
  );
}
