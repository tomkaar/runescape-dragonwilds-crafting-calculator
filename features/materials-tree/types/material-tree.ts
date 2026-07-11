import { Item, ItemVariant } from "@/Types"; 

type MaterialTreeItemData = {
  id: string;
  nodeId: string;
  item: Item;
  quantity: number;
  variant?: ItemVariant;
  variantNumber?: number;
  facilities: string[];
  isEnd?: boolean;
};

export type MaterialTreeItem =
  | MaterialTreeItemData
  | (MaterialTreeItemData & {
      children: MaterialTreeItem[];
    });
