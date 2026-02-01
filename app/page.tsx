import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { SearchBox } from "@/components/SearchBox";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md">
          <h1 className="text-2xl mb-4">
            Runescape: Dragonwilds <br />{" "}
            <span className="block -mt-1 text-sm">Crafting calculator</span>
          </h1>
          <SearchBox />
          <FavouriteItemsList />
        </div>
      </main>
    </div>
  );
}
