import { Suspense } from "react";

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
import { UsedInTrigger } from "@/components/Items/UsedIn/Trigger";
import { UsedInContent } from "@/components/Items/UsedIn/Content";

type Props = {
  itemId: string;
};

export function UsedInDesktopPanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.usedIn.id}
      defaultSize={ITEM_PANEL_CONFIGS.usedIn.defaultSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <UsedInTrigger />
        </CollapsiblePanelDesktopButtonTrigger>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <Suspense>
          <UsedInContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function UsedInMobilePanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelMobileRoot id={ITEM_PANEL_CONFIGS.usedIn.id}>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <UsedInTrigger />
        </CollapsiblePanelMobileButtonTrigger>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <Suspense>
          <UsedInContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
