import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { SearchBox } from "@/components/SearchBox";
import { type Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Dragonwilds Crafting Calculator",
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md px-4">
          <h1 className="text-2xl text-title mb-4">
            Runescape: Dragonwilds <br />{" "}
            <span className="block -mt-1 text-sm">Crafting calculator</span>
          </h1>
          <SearchBox />
          <div className="mt-6">
            <FavouriteItemsList />
          </div>
        </div>
      </main>
    </div>
  );
}
