import { Suspense } from "react";
import { ItemTable } from "@/components/ItemTable/ItemTable";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Items | Dragonwilds Crafting Calculator",
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export default function ItemPage() {
  return (
    <main className="h-full flex flex-col">
      <Suspense>
        <ItemTable />
      </Suspense>
    </main>
  );
}
