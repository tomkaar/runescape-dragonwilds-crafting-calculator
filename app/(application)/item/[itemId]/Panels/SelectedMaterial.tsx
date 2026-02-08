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
import { SelectedMaterialsTrigger } from "@/components/Items/SelectedMaterials/Trigger";
import { SelectedMaterialsAction } from "@/components/Items/SelectedMaterials/Action";
import { SelectedMaterialContent } from "@/components/Items/SelectedMaterials/Content";

type Props = {
  itemId: string;
};

export function SelectedMaterialDesktopPanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.selectedMaterials.id}
      defaultSize={ITEM_PANEL_CONFIGS.selectedMaterials.defaultSize}
      minSize={ITEM_PANEL_CONFIGS.selectedMaterials.minSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <SelectedMaterialsTrigger itemId={itemId} />
        </CollapsiblePanelDesktopButtonTrigger>
        <Suspense>
          <SelectedMaterialsAction itemId={itemId} />
        </Suspense>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <Suspense>
          <SelectedMaterialContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function SelectedMaterialMobilePanel(props: Props) {
  const { itemId } = props;

  return (
    <CollapsiblePanelMobileRoot id={ITEM_PANEL_CONFIGS.selectedMaterials.id}>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <SelectedMaterialsTrigger itemId={itemId} />
        </CollapsiblePanelMobileButtonTrigger>
        <Suspense>
          <SelectedMaterialsAction itemId={itemId} />
        </Suspense>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <Suspense>
          <SelectedMaterialContent itemId={itemId} />
        </Suspense>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
