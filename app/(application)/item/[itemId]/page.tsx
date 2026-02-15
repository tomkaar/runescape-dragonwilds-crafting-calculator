import { getItemById } from "@/utils/itemById";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import ContentMobile from "./ContentMobile";
import ContentDesktop from "./ContentDesktop";

import { Suspense } from "react";

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

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  const item = getItemById(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <main className="h-full flex flex-col">
      <div className="block lg:hidden">
        <Suspense>
          <ContentMobile item={item} itemId={itemId} />
        </Suspense>
      </div>

      <div className="h-full w-full hidden lg:block">
        <Suspense>
          <ContentDesktop item={item} itemId={itemId} />
        </Suspense>
      </div>
    </main>
  );
}
