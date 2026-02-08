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
import { AllMaterialsTrigger } from "@/components/Items/AllMaterials/Trigger";
import { AllMaterialsAction } from "@/components/Items/AllMaterials/Action";
import { AllMaterialsContent } from "@/components/Items/AllMaterials/Content";

export function AllMaterialsDesktopPanel() {
  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.allMaterials.id}
      defaultSize={ITEM_PANEL_CONFIGS.allMaterials.defaultSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <AllMaterialsTrigger />
        </CollapsiblePanelDesktopButtonTrigger>
        <Suspense>
          <AllMaterialsAction />
        </Suspense>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <Suspense>
          <AllMaterialsContent />
        </Suspense>
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function AllMaterialsMobilePanel() {
  return (
    <CollapsiblePanelMobileRoot>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <AllMaterialsTrigger />
        </CollapsiblePanelMobileButtonTrigger>
        <Suspense>
          <AllMaterialsAction />
        </Suspense>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <Suspense>
          <AllMaterialsContent />
        </Suspense>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
