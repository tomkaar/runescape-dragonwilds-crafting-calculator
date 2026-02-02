"use client";

import { Check, ChevronDown, CirclePile, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { resolveCraftingTree } from "../CraftingTree/resolveCraftingTree";
import {
  buildMaterialsTree,
  type MaterialTreeItem,
} from "./buildMaterialsTree";
import Image from "next/image";
import { createImageUrlPath } from "@/playground/items/utils/image";
import { useSelectedMaterial } from "@/store/selected-material";
import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  itemId: string;
};

export function RequiredMaterials(props: Props) {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);

  const treeData = resolveCraftingTree(props.itemId, props.itemId, 1);
  const tree = treeData
    ? buildMaterialsTree(treeData.nodes, treeData.edges)
    : [];

  // Skip the first layer (root node) and render its children
  const materialsToRender =
    tree.length > 0 && "children" in tree[0] ? tree[0].children : [];

  const numberOfMaterials = materialsToRender
    .map((item) => item.quantity)
    .reduce((a, b) => a + b, 0);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
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
      id="materials"
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
        <CirclePile className="w-4 h-4 text-neutral-600 fill-neutral-600" />
        Required Materials ({numberOfMaterials} total)
      </button>

      <div className="pt-2 overflow-scroll h-full pb-15">
        <div ref={contentRef} className="flex flex-col gap-1 w-full">
          {materialsToRender.map((item) => (
            <MaterialTreeNode
              key={item.nodeId}
              item={item}
              initialItemId={props.itemId}
            />
          ))}
        </div>
      </div>
    </Panel>
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
      <Collapsible key={item.nodeId}>
        <div className="flex flex-row items-center">
          {item.variantNumber === undefined && (
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
                <span>{item.item.name}</span>
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
