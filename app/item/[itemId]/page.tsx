import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { ItemFavourites } from "@/components/Items/Favourites";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { UsedIn } from "@/components/Items/UsedIn";

import { getItemByNameOrId } from "@/utils/getItemById";
import { notFound } from "next/navigation";

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
      <div className="w-80 overflow-scroll h-[calc(100vh-70px)] flex flex-col border-r border-neutral-800">
        <div className="p-4 grow">
          <ItemInfoBox item={item} itemId={itemId} />
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
    </div>
  );
}
