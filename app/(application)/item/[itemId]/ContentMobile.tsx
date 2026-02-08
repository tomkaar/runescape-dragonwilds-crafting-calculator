"use client";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/Items/SelectedMaterials/SelectedMaterials";
import { Item } from "@/Types";
import { Attribution } from "@/components/Items/Attribution";
import { AllMaterials } from "@/components/Items/AllMaterials";
import { SelectedRecipes } from "@/components/Items/SelectedRecipes";
import { Suspense } from "react";

export default function ContentMobile({
  item,
  itemId,
}: {
  item: Item;
  itemId: string;
}) {
  return (
    <div>
      <div>
        <div className="bg-neutral-950">
          <ItemInfoBox item={item} itemId={itemId} />
          <RequiredMaterials itemId={itemId} variant="mobile" />
          <SelectedMaterial itemId={itemId} variant="mobile" />
          <UsedIn itemId={itemId} variant="mobile" />
          <AllMaterials itemId={itemId} variant="mobile" />
          <SelectedRecipes itemId={itemId} variant="mobile" />
        </div>
      </div>

      <Suspense>
        <div className="bg-neutral-900 w-full h-full min-h-65">
          <CraftingTree itemId={itemId} className="h-65" />
        </div>
      </Suspense>

      <Attribution variant="mobile" />
    </div>
  );
}
