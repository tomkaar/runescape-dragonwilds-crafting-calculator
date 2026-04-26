"use client";

import { useSelectedMaterial } from "@/store/selected-material";
import { AllMaterialsContent } from "@/components/Items/AllMaterials/Content";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionAllMaterials() {
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const hasItems = Object.values(rawRecipes).some((v) => v.length > 0);

  if (!hasItems) return null;

  return (
    <AccordionItem
      value="selected"
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="text-foreground px-4">
        <div className="flex flex-col">
          Selected materials
          <span className="text-xs text-muted-foreground">
            Check materials as you gather/craft them.
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 text-foreground">
        <AllMaterialsContent />
      </AccordionContent>
    </AccordionItem>
  );
}
