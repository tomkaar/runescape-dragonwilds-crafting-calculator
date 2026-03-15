import { ItemInfoBox } from "@/components/Items/InfoBox/InfoBox";
import { Item } from "@/Types";
import { Suspense } from "react";
import { MaterialsMobilePanel } from "./Panels/Materials";
import { UsedInMobilePanel } from "./Panels/UsedIn";
import { AttributionMobilePanel } from "./Panels/Attribution";
import { AllMaterialsMobilePanel } from "./Panels/AllMaterials";
import { AllRecipesMobilePanel } from "./Panels/AllRecipes";
import { CraftingTreeMobilePanel } from "./Panels/CraftingTree";

export default async function ContentMobile({
  item,
  itemId,
}: {
  item: Item;
  itemId: string;
}) {
  return (
    <div>
      <div className="bg-background">
        <ItemInfoBox item={item} itemId={itemId} />
        <MaterialsMobilePanel itemId={itemId} />
        <UsedInMobilePanel itemId={itemId} />
        <AllMaterialsMobilePanel />
        <AllRecipesMobilePanel />
      </div>

      <Suspense>
        <div className="bg-card w-full h-full">
          <CraftingTreeMobilePanel itemId={itemId} />
        </div>
      </Suspense>

      <AttributionMobilePanel />
    </div>
  );
}
