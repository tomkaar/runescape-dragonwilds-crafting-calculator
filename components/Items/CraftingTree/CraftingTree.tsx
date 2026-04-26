import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Panel } from "@xyflow/react";
import { ClearSelected } from "../../CraftingTree/Buttons/ClearSelected";
import { Direction } from "../../CraftingTree/Buttons/Direction";

export function AccordionCraftingTree({ itemId }: { itemId: string }) {
  return (
    <AccordionItem
      value="crafting-tree"
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="text-foreground px-4">
        <div className="flex flex-col">
          Crafting Tree
          <span className="text-xs text-muted-foreground">
            See the full crafting tree for this item.
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="h-100">
        <CraftingTree itemId={itemId}>
          <Panel position="top-right" className="flex gap-2">
            <ClearSelected itemId={itemId} />
            <Direction />
          </Panel>
        </CraftingTree>
      </AccordionContent>
    </AccordionItem>
  );
}
