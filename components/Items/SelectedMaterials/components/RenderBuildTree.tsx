import { Check } from "lucide-react";

import { TreeItem } from "../utils/buildTreeFromNodeIds";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useCraftingTreeHover } from "@/context/crafting-tree-hover";

type Props = {
  handleSetAsDone: (nodeId: string) => void;
  tree: TreeItem[];
  multiplier?: number;
};

export function RenderBuildTree(props: Props) {
  const { handleSetAsDone, tree, multiplier = 1 } = props;
  const { enter, reset } = useCraftingTreeHover();

  const renderItem = (fileItem: TreeItem) => {
    if ("items" in fileItem) {
      return (
        <div key={fileItem.item.name}>
          <button
            onClick={() => handleSetAsDone(fileItem.nodeId)}
            onMouseEnter={() => enter(fileItem.nodeId)}
            onMouseLeave={() => reset()}
            onFocus={() => enter(fileItem.nodeId)}
            onBlur={() => reset()}
            className={`
                cursor-pointer inline-flex flex-row gap-2 px-2 py-2 rounded-lg text-sm group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none
                ${fileItem.quantity === null ? "opacity-75" : ""}
              `}
          >
            {fileItem.item.image && (
              <img
                src={createImageUrlPath(fileItem.item.image)}
                alt={fileItem.item.name}
                width={20}
                height={20}
                className="min-w-5 min-h-5 max-h-5 max-w-5"
              />
            )}
            <span>
              {fileItem.quantity !== null && (
                <span className="font-semibold">
                  {fileItem.quantity * multiplier}x{" "}
                </span>
              )}
              {fileItem.item.name}
              {fileItem.variant !== undefined && (
                <span className="text-xs leading-normal italic text-neutral-400">
                  {" "}
                  (Recipe {fileItem.variantNumber})
                </span>
              )}
            </span>
          </button>

          <div className="style-lyra:ml-4 mt-1 ml-5">
            <div className="flex flex-col gap-1 border-l border-neutral-500">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        key={fileItem.item.name}
        onClick={() => handleSetAsDone(fileItem.nodeId)}
        onMouseEnter={() => enter(fileItem.nodeId)}
        onMouseLeave={() => reset()}
        className="group cursor-pointer inline-flex flex-row gap-2 px-2 py-1 rounded-lg text-sm text-foreground w-full justify-start hover:bg-accent hover:text-accent-foreground"
      >
        {fileItem.item.image && (
          <img
            src={createImageUrlPath(fileItem.item.image)}
            alt={fileItem.item.name}
            width={20}
            height={20}
            className="min-w-5 min-h-5 max-h-5 max-w-5"
          />
        )}
        <span className="">
          {fileItem.quantity !== null && (
            <span className="font-semibold">
              {fileItem.quantity * multiplier}x
            </span>
          )}
          <span> {fileItem.item.name}</span>
        </span>
        <div className="relative cursor-pointer text-green-700 hover:text-green-700 active:text-green-700">
          <Check width={20} height={20} />
          <span className="absolute whitespace-nowrap top-0 left-6 text-sm text-green-700 opacity-0 group-hover:opacity-100">
            Mark as done
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="overflow-x-scroll flex flex-col gap-1 mt-1 w-full">
      {tree.map((item) => renderItem(item))}
    </div>
  );
}
