import { AllMaterialsContent } from "@/components/Items/AllMaterials/Content";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionAllMaterials() {
  return (
    <AccordionItem
      value="selected"
      className="bg-neutral-900 rounded-lg border border-accent"
    >
      <AccordionTrigger className="cursor-pointer text-white px-4">
        <div className="flex flex-col">
          Selected materials
          <span className="text-xs text-neutral-300">
            Check materials as you gather/craft them.
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 text-white">
        <AllMaterialsContent />
      </AccordionContent>
    </AccordionItem>
  );
}
