import { SearchBox } from "@/components/SearchBox";
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

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className="h-screen">
      <div className="sticky top-0 border-b bg-background border-neutral-700 flex flex-col md:flex-row gap-6 md:items-center w-full p-4">
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

          <div className="shrink-0 flex md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-pointer"
                  >
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
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-neutral-800"
                  >
                    <HomeIcon size={16} />
                    Home
                  </Link>
                  <Link
                    href="/item"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-neutral-800"
                  >
                    <ListIcon size={16} />
                    All items
                  </Link>
                  <a
                    href="https://dragonwilds.runescape.wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-neutral-800"
                  >
                    <Scale size={16} />
                    Official Wiki
                  </a>
                  <a
                    href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-neutral-800"
                  >
                    <GithubIcon size={16} />
                    GitHub
                  </a>
                </nav>
                <div className="px-6 mt-2">
                  <p className="text-xs text-muted-foreground border-t border-neutral-700 pt-4">
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

        <div className="grow flex flex-row justify-center md:justify-start items-center gap-4">
          <div className="w-full md:max-w-80">
            <SearchBox />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="group cursor-pointer">
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

          <div className="hidden md:block">
            <Link
              href="/item"
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-neutral-800 whitespace-nowrap"
            >
              <ListIcon size={16} />
              All items
            </Link>
          </div>
        </div>

        <div className="shrink-0 hidden md:flex gap-2 flex-row">
          <Dialog>
            <DialogTrigger asChild>
              <button className="cursor-pointer border border-neutral-800 rounded-full p-1.5 size-9 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Affirmation</DialogTitle>
                <DialogDescription>
                  <span className="text-xs text-neutral-200">
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
            href="/"
            className="border border-neutral-800 rounded-full p-1.5 size-9 flex items-center justify-center"
          >
            <GithubIcon size={20} />
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-129px)] md:h-[calc(100vh-69px)]">
        {props.children}
      </div>
    </div>
  );
}
