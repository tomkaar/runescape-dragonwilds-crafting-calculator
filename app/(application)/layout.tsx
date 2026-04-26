import { SearchBox } from "@/components/SearchBox";
import { ProgressNavLink } from "@/components/Progress/ProgressNavLink";
import {
  AnvilIcon,
  GithubIcon,
  HomeIcon,
  ListIcon,
  MenuIcon,
  Scale,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FavouriteItemsList } from "@/components/FavouriteItemsList";
import { LastSynced } from "@/components/LastSynced/LastSynced";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className="h-screen">
      <div className="sticky top-0 z-10 border-b bg-background border-border flex flex-col lg:flex-row gap-6 lg:items-center w-full p-4">
        <div className="flex flex-row items-center justify-between">
          <Link href="/">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-title border-2 border-title rounded-full p-1.5">
                <AnvilIcon size={20} />
              </div>
              <h1 className="text-base font-bold text-title whitespace-nowrap">
                RuneScape: Dragonwilds
                <br />{" "}
                <span className="block -mt-1 text-xs font-normal">
                  Crafting calculator
                </span>
              </h1>
            </div>
          </Link>

          <div className="shrink-0 flex lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <MenuIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                }
              />
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
                  >
                    <HomeIcon size={16} />
                    Home
                  </Link>
                  <Link
                    href="/item"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
                  >
                    <ListIcon size={16} />
                    All items
                  </Link>
                  <ProgressNavLink className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card" />
                  <a
                    href="https://dragonwilds.runescape.wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
                  >
                    <Scale size={16} />
                    Official Wiki
                  </a>
                  <a
                    href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
                  >
                    <GithubIcon size={16} />
                    GitHub
                  </a>
                </nav>
                <div className="px-6 mt-2 flex flex-col gap-3 text-start">
                  <LastSynced />
                  <p className="text-xs text-muted-foreground border-t border-border pt-3">
                    Data from the RuneScape: Dragonwilds Wiki. Content licensed
                    under CC BY-NC-SA 3.0. Not affiliated with Jagex Ltd.,
                    RuneScape: Dragonwilds Wiki or Weird Gloop. Data may not
                    always be accurate or up-to-date.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grow flex flex-row justify-center lg:justify-start items-center gap-4">
          <div className="w-full lg:max-w-80">
            <SearchBox />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="group">
                <StarIcon className="group-data-[state=open]:text-title group-data-[state=open]:fill-title" />
                Favourites
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center">
              <PopoverHeader>
                <PopoverTitle>Favourites</PopoverTitle>
                <PopoverDescription>
                  Click on the star icon next to an item to add it to your
                  favourites.
                </PopoverDescription>
                <div className="mt-2">
                  <FavouriteItemsList />
                </div>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <div className="hidden lg:block">
            <Link
              href="/item"
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card whitespace-nowrap"
            >
              <ListIcon size={16} />
              All items
            </Link>
          </div>
          <div className="hidden lg:block">
            <ProgressNavLink className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card whitespace-nowrap" />
          </div>
        </div>

        <div className="shrink-0 hidden lg:flex gap-2 flex-row items-center">
          <div className="hidden lg:block">
            <LastSynced />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Affirmation</DialogTitle>
                <DialogDescription>
                  <span className="text-xs text-foreground">
                    <span className="block mt-2">
                      Data from the RuneScape: Dragonwilds Wiki
                    </span>

                    <span className="block mt-2">
                      Content licensed under CC BY-NC-SA 3.0
                    </span>

                    <span className="block mt-2">
                      Not affiliated with Jagex Ltd., RuneScape: Dragonwilds
                      Wiki or Weird Gloop
                    </span>

                    <span className="block mt-2">
                      Data on this page are based on wiki data and content on
                      this page may not always be accurate or up-to-date. Please
                      verify with official sources.
                    </span>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Link
            href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
            className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center"
          >
            <GithubIcon size={20} />
          </Link>
        </div>
      </div>

      <div className="lg:h-[calc(100vh-69px)]">{props.children}</div>
    </div>
  );
}
