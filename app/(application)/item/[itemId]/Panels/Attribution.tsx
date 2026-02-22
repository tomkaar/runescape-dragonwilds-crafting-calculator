import {
  CollapsiblePanelMobileButtonLayout,
  CollapsiblePanelMobileButtonTrigger,
  CollapsiblePanelMobileContent,
  CollapsiblePanelMobileRoot,
} from "@/components/CollapsiblePanel/mobile";
import { ITEM_PANEL_CONFIGS } from "@/constants/item-panels";
import { AttributionTrigger } from "@/components/Items/Attribution/Trigger";
import { AttributionContent } from "@/components/Items/Attribution/Content";

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
