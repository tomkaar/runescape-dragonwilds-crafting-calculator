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
import { RequiredMaterialsContent } from "@/components/Items/RequiredMaterials/Content";
import { RequiredMaterialsAction } from "@/components/Items/RequiredMaterials/Action";
import { RequiredMaterialsTrigger } from "@/components/Items/RequiredMaterials/Trigger";
import { Suspense } from "react";

type Props = {
  itemId: string;
};

export function RequiredMaterialsDesktopPanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.materials.id}
      defaultSize={ITEM_PANEL_CONFIGS.materials.defaultSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <RequiredMaterialsTrigger />
        </CollapsiblePanelDesktopButtonTrigger>
        <Suspense>
          <RequiredMaterialsAction itemId={itemId} />
        </Suspense>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <Suspense>
          <RequiredMaterialsContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function RequiredMaterialsMobilePanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelMobileRoot>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <RequiredMaterialsTrigger />
        </CollapsiblePanelMobileButtonTrigger>
        <Suspense>
          <RequiredMaterialsAction itemId={itemId} />
        </Suspense>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <Suspense>
          <RequiredMaterialsContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
