import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { type Metadata } from "next";
import Link from "next/link";
import {
  AnvilIcon,
  CheckSquareIcon,
  ExternalLinkIcon,
  SearchIcon,
  StarIcon,
  TableIcon,
} from "lucide-react";
import { CommandWithShortcuts } from "@/features/command/components/command-with-shortcuts";

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
            <CommandWithShortcuts buttonClassName="lg:w-full" />
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

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="https://dragonwilds.runescape.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm hover:bg-card/50 transition-colors"
              >
                <ExternalLinkIcon className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="font-medium">Official site</span>
                  <span className="block text-xs text-muted-foreground">
                    Visit the official Dragonwilds website
                  </span>
                </div>
              </Link>
              <Link
                href="https://dragonwilds.runescape.wiki/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm hover:bg-card/50 transition-colors"
              >
                <ExternalLinkIcon className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="font-medium">Wiki</span>
                  <span className="block text-xs text-muted-foreground">
                    Visit the Dragonwilds wiki for detailed information
                  </span>
                </div>
              </Link>
            </div>
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
