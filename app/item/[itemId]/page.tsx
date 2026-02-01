import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
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
      <div className="p-4 w-80 border-r border-neutral-800">
        <h2>{item.name}</h2>
      </div>

      <div className="grow bg-neutral-900">
        <CraftingTree itemId={itemId} />
      </div>
    </div>
  );
}
