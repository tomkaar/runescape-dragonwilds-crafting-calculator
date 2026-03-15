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
import { RequiredMaterialsContent } from "@/components/Items/Materials/Content";
import { MaterialsAction } from "@/components/Items/Materials/Action";
import { MaterialsTrigger } from "@/components/Items/Materials/Trigger";

type Props = {
  itemId: string;
};

export function MaterialsDesktopPanel({ itemId }: Props) {
  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.materials.id}
      defaultSize={ITEM_PANEL_CONFIGS.materials.defaultSize}
      minSize={ITEM_PANEL_CONFIGS.materials.minSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <MaterialsTrigger itemId={itemId} />
        </CollapsiblePanelDesktopButtonTrigger>
        <Suspense>
          <MaterialsAction itemId={itemId} />
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

export function MaterialsMobilePanel({ itemId }: Props) {
  return (
    <CollapsiblePanelMobileRoot id={ITEM_PANEL_CONFIGS.materials.id}>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <MaterialsTrigger itemId={itemId} />
        </CollapsiblePanelMobileButtonTrigger>
        <Suspense>
          <MaterialsAction itemId={itemId} />
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
