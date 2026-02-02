"use client";

import { createImageUrlPath } from "@/playground/items/utils/image";
import { useSelectedMaterial } from "@/store/selected-material";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  buildTreeFromNodeIds,
  type TreeItem,
} from "./Items/SelectedMaterials/buildTreeFromNodeIds";

type Props = {
  itemId: string;
};

export function SelectedMaterial(props: Props) {
  const { itemId } = props;

  const removeMaterial = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );
  const handleRemoveMaterial = (id: string) => {
    console.log("Removing material:", id);
    removeMaterial(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = i[props.itemId] || [];

  console.log("Selected materials:", selectedMaterials);
  const tree = buildTreeFromNodeIds(selectedMaterials);
  // console.log("Material tree:", tree);

  const renderItem = (fileItem: TreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={fileItem.item.name} defaultOpen={true}>
          <CollapsibleTrigger className="w-full">
            <div
              className={`
                inline-flex flex-row gap-2 px-4 py-2 rounded-lg text-sm group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none
                ${fileItem.quantity === null ? "opacity-75" : ""}
              `}
            >
              {fileItem.item.image && (
                <Image
                  src={createImageUrlPath(fileItem.item.image)}
                  alt={fileItem.item.name}
                  width={20}
                  height={20}
                />
              )}
              {fileItem.quantity !== null && (
                <span className="font-semibold">{fileItem.quantity}x</span>
              )}
              {fileItem.item.name}
              {fileItem.variantNumber && (
                <span className="text-muted-foreground">
                  (Recipe {fileItem.variantNumber})
                </span>
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="style-lyra:ml-4 mt-1 ml-5">
            <div className="flex flex-col gap-1">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <div
        key={fileItem.item.name}
        className="inline-flex flex-row gap-2 px-4 py-2 rounded-lg text-sm text-foreground w-full justify-start hover:bg-accent hover:text-accent-foreground"
      >
        {fileItem.item.image && (
          <Image
            src={createImageUrlPath(fileItem.item.image)}
            alt={fileItem.item.name}
            width={20}
            height={20}
          />
        )}
        {fileItem.quantity !== null && (
          <span className="font-semibold">{fileItem.quantity}x</span>
        )}
        <span>{fileItem.item.name}</span>
        {fileItem.variantNumber && (
          <span className="text-muted-foreground">
            (Recipe {fileItem.variantNumber})
          </span>
        )}
        <button
          onClick={() => handleRemoveMaterial(fileItem.nodeId)}
          className="cursor-pointer text-rose-700 hover:text-rose-700 active:text-rose-700"
        >
          <X width={20} height={20} />
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <h3 className="text-lg">Selected materials</h3>
        <p className="text-sm">Click on a material to add it to the list</p>

        <div className="flex flex-col gap-1 mt-4 w-full">
          {tree.map((item) => renderItem(item))}
        </div>
      </div>
    </div>
  );
}
