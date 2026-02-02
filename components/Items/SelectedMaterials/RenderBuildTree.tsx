import { X } from "lucide-react";
import Image from "next/image";

import { createImageUrlPath } from "@/playground/items/utils/image";
import { TreeItem } from "./buildTreeFromNodeIds";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";

type Props = { handleRemoveNode: (nodeId: string) => void; tree: TreeItem[] };

export function RenderBuildTree(props: Props) {
  const { handleRemoveNode, tree } = props;

  const renderItem = (fileItem: TreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible
          key={fileItem.item.name}
          defaultOpen={true}
          className="hover:bg-white/5 hover:rounded-lg data-[state=open]:py-0 transition-all"
        >
          <CollapsibleTrigger className="w-full">
            <div
              className={`
                cursor-pointer inline-flex flex-row gap-2 px-2 py-2 rounded-lg text-sm group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none
                ${fileItem.quantity === null ? "opacity-75" : ""}
              `}
            >
              {fileItem.item.image && fileItem.variant === undefined && (
                <Image
                  src={createImageUrlPath(fileItem.item.image)}
                  alt={fileItem.item.name}
                  width={20}
                  height={20}
                  className="min-w-5 min-h-5 max-h-5 max-w-5"
                />
              )}
              <span>
                {fileItem.quantity !== null && (
                  <span className="font-semibold">{fileItem.quantity}x </span>
                )}
                {fileItem.item.name}
                {fileItem.variant !== undefined && (
                  <span className="text-xs leading-normal italic text-neutral-400">
                    {" "}
                    (Recipe {fileItem.variantNumber})
                  </span>
                )}
              </span>
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
        className="inline-flex flex-row gap-2 px-2 py-1 rounded-lg text-sm text-foreground w-full justify-start hover:bg-accent hover:text-accent-foreground"
      >
        {fileItem.item.image && (
          <Image
            src={createImageUrlPath(fileItem.item.image)}
            alt={fileItem.item.name}
            width={20}
            height={20}
            className="min-w-5 min-h-5 max-h-5 max-w-5"
          />
        )}
        <span className="">
          {fileItem.quantity !== null && (
            <span className="font-semibold">{fileItem.quantity}x</span>
          )}
          <span> {fileItem.item.name}</span>
        </span>
        <button
          onClick={() => handleRemoveNode(fileItem.nodeId)}
          className="cursor-pointer text-rose-700 hover:text-rose-700 active:text-rose-700"
        >
          <X width={20} height={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-scroll flex flex-col gap-1 mt-4 w-full">
      {tree.map((item) => renderItem(item))}
    </div>
  );
}
