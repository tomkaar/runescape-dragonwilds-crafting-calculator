import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { SearchBox } from "@/components/SearchBox";
import { type Metadata } from "next";
import Link from "next/link";
import { AnvilIcon, CheckSquareIcon, SearchIcon, StarIcon, TableIcon } from "lucide-react";

export function generateMetadata(): Metadata {
  return {
    title: "Dragonwilds Crafting Calculator",
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export default function Home() {
  return (
    <div className="pattern-square">
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-row items-center gap-2">
            <div className="text-title border-2 border-title rounded-full p-1.5">
              <AnvilIcon size={24} />
            </div>

            <h1 className="text-2xl text-title font-bold">
              RuneScape: Dragonwilds
              <span className="block -mt-1 text-sm font-normal">
                Crafting calculator
              </span>
            </h1>
          </div>

          {/* Quick search */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SearchIcon className="size-3.5" />
              <span>Quick search</span>
            </div>
            <SearchBox />
          </section>

          {/* Navigation links */}
          <section className="flex flex-col gap-2">
            <Link
              href="/item"
              className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm hover:bg-card/50 transition-colors"
            >
              <TableIcon className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="font-medium">Browse all items</span>
                <span className="block text-xs text-muted-foreground">
                  Search, filter, and sort the full item table
                </span>
              </div>
            </Link>
            <Link
              href="/progress"
              className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm hover:bg-card/50 transition-colors"
            >
              <CheckSquareIcon className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="font-medium">Progress tracker</span>
                <span className="block text-xs text-muted-foreground">
                  Track materials and next steps across all items
                </span>
              </div>
            </Link>
          </section>

          {/* Favourites */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <StarIcon className="size-3.5" />
              <span>Favourites</span>
            </div>
            <FavouriteItemsList />
            <p className="text-xs text-muted-foreground">
              Star items to add them here for quick access.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
