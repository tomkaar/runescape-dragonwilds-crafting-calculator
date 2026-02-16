import {
  CollapsiblePanelMobileButtonLayout,
  CollapsiblePanelMobileButtonTrigger,
  CollapsiblePanelMobileContent,
  CollapsiblePanelMobileRoot,
} from "@/components/CollapsiblePanel/mobile";
import { ITEM_PANEL_CONFIGS } from "@/constants/item-panels";
import { AttributionTrigger } from "@/components/Items/Attribution/Trigger";
import { AttributionContent } from "@/components/Items/Attribution/Content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Attribution() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full py-6 text-start cursor-pointer flex justify-start radius-none border-t border-neutral-700 rounded-t-none"
        >
          <AttributionTrigger />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Affirmation</DialogTitle>
          <DialogDescription>
            <AttributionContent />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function AttributionMobilePanel() {
  return (
    <CollapsiblePanelMobileRoot id={ITEM_PANEL_CONFIGS.attribution.id}>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <AttributionTrigger />
        </CollapsiblePanelMobileButtonTrigger>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <p className="px-4 text-xs text-neutral-200">
          <AttributionContent />
        </p>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
