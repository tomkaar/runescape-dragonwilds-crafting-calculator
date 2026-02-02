import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { ItemFavourites } from "@/components/Items/Favourites";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/Items/SelectedMaterials/SelectedMaterials";
import { Button } from "@/components/ui/button";

import { getItemByNameOrId } from "@/utils/getItemById";
import { notFound } from "next/navigation";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";

type Props = {
  params: Promise<{ itemId: string }>;
};

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;
  const item = getItemByNameOrId(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <div className="h-full flex flex-row">
      <div className="w-88 overflow-scroll h-[calc(100vh-70px)] flex flex-col border-r border-neutral-800">
        <div className="p-4 grow">
          <ItemInfoBox item={item} itemId={itemId} />
        </div>
        <div className="border-t border-neutral-800">
          <RequiredMaterials itemId={itemId} />
        </div>
        <div className="border-t border-neutral-800">
          <UsedIn itemId={itemId} />
        </div>
        <div className="border-t border-neutral-800">
          <ItemFavourites />
        </div>
      </div>

      <div className="grow bg-neutral-900">
        <CraftingTree itemId={itemId} />
      </div>

      <div className="w-88 h-full flex flex-col gap-4">
        <div className="p-4 grow">
          <SelectedMaterial itemId={itemId} />
        </div>
        <div className="p-4">
          <Button className="w-full" variant="default">
            See all materials
          </Button>
        </div>
      </div>
    </div>
  );
}
