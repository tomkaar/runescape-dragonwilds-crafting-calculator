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

  console.log("Item:", item);

  return (
    <div>
      <h2>{item.name}</h2>
    </div>
  );
}
