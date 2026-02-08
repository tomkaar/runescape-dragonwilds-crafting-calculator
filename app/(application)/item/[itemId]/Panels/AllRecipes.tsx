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
import { AllRecipesTrigger } from "@/components/Items/AllRecipes/Trigger";
import { AllRecipesContent } from "@/components/Items/AllRecipes/Content";

export function AllRecipesDesktopPanel() {
  return (
    <CollapsiblePanelDesktopRoot
      id={ITEM_PANEL_CONFIGS.selectedRecipes.id}
      defaultSize={ITEM_PANEL_CONFIGS.selectedRecipes.defaultSize}
    >
      <CollapsiblePanelDesktopButtonLayout>
        <CollapsiblePanelDesktopButtonTrigger>
          <AllRecipesTrigger />
        </CollapsiblePanelDesktopButtonTrigger>
      </CollapsiblePanelDesktopButtonLayout>

      <CollapsiblePanelDesktopContent>
        <Suspense>
          <AllRecipesContent />
        </Suspense>
      </CollapsiblePanelDesktopContent>
    </CollapsiblePanelDesktopRoot>
  );
}

export function AllRecipesMobilePanel() {
  return (
    <CollapsiblePanelMobileRoot>
      <CollapsiblePanelMobileButtonLayout>
        <CollapsiblePanelMobileButtonTrigger>
          <AllRecipesTrigger />
        </CollapsiblePanelMobileButtonTrigger>
      </CollapsiblePanelMobileButtonLayout>
      <CollapsiblePanelMobileContent>
        <Suspense>
          <AllRecipesContent />
        </Suspense>
      </CollapsiblePanelMobileContent>
    </CollapsiblePanelMobileRoot>
  );
}
