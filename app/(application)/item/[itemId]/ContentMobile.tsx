import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { Item } from "@/Types";
import { Suspense } from "react";
import { RequiredMaterialsMobilePanel } from "./Panels/RequiredMaterials";
import { SelectedMaterialMobilePanel } from "./Panels/SelectedMaterial";
import { UsedInMobilePanel } from "./Panels/UsedIn";
import { AttributionMobilePanel } from "./Panels/Attribution";
import { AllMaterialsMobilePanel } from "./Panels/AllMaterials";
import { AllRecipesMobilePanel } from "./Panels/AllRecipes";

export default async function ContentMobile({
  item,
  itemId,
}: {
  item: Item;
  itemId: string;
}) {
  return (
    <div>
      <div className="bg-neutral-950">
        <ItemInfoBox item={item} itemId={itemId} />
        <RequiredMaterialsMobilePanel itemId={itemId} />
        <SelectedMaterialMobilePanel itemId={itemId} />
        <UsedInMobilePanel itemId={itemId} />
        <AllMaterialsMobilePanel />
        <AllRecipesMobilePanel />
      </div>

      <Suspense>
        <div className="bg-neutral-900 w-full h-full min-h-65">
          <CraftingTree itemId={itemId} className="h-65" />
        </div>
      </Suspense>

      <AttributionMobilePanel />
    </div>
  );
}
