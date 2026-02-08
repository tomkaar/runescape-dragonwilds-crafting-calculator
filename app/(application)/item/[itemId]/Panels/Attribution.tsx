import {
  CollapsiblePanelDesktopButtonLayout,
  CollapsiblePanelDesktopButtonTrigger,
  CollapsiblePanelDesktopContent,
  CollapsiblePanelDesktopRoot,
} from "@/components/CollapsiblePanel/desktop";
import {
  CollapsiblePanelMobileButtonLayout,
  CollapsiblePanelMobileButtonTrigger,
  CollapsiblePanelMobileContent,
  CollapsiblePanelMobileRoot,
} from "@/components/CollapsiblePanel/mobile";
import { ITEM_PANEL_CONFIGS } from "@/constants/item-panels";
import { AttributionTrigger } from "@/components/Items/Attribution/Trigger";
import { AttributionContent } from "@/components/Items/Attribution/Content";

export function AttributionDesktopPanel() {
  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.attribution.id}
      defaultSize={ITEM_PANEL_CONFIGS.usedIn.defaultSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <AttributionTrigger />
        </CollapsiblePanelDesktopButtonTrigger>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <AttributionContent />
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function AttributionMobilePanel() {
  return (
    <CollapsiblePanelMobileRoot>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <AttributionTrigger />
        </CollapsiblePanelMobileButtonTrigger>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <AttributionContent />
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
