import { getItemById } from "@/utils/itemById";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import ContentMobile from "./ContentMobile";
import ContentDesktop from "./ContentDesktop";

import itemJSON from "@/data/items.json";
import { Item } from "@/Types";

const items = itemJSON.sort((a, b) => a.name.localeCompare(b.name)) as Item[];

type Props = {
  params: Promise<{ itemId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { itemId } = await props.params;
  const item = getItemById(itemId);

  return {
    title: [item?.name, "Dragonwilds Crafting Calculator"]
      .filter((s) => s !== null && s !== undefined)
      .join(" | "),
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export function generateStaticParams() {
  return items.map((item) => ({
    itemId: item.id,
  }));
}

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  const item = getItemById(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <main className="h-full flex flex-col">
      <div className="block lg:hidden">
        <ContentMobile item={item} itemId={itemId} />
      </div>

      <div className="h-full w-full hidden lg:block">
        <ContentDesktop item={item} itemId={itemId} />
      </div>
    </main>
  );
}
