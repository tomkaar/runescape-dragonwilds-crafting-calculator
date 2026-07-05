import { type Item, type ItemVariant } from "@/Types";

export type ResolvedItem = {
  item: Item;
  variant: ItemVariant;
  variantIndex: number | null;
  quantityNeeded: number;
  quantityRecieved: number;
  hasExcessItems: boolean;
  facilities: string[];
  isLeaf: boolean;
  children: ResolvedItem[];
};
