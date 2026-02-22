import { SearchBox } from "@/components/SearchBox";
import { AnvilIcon, GithubIcon, Scale, StarIcon } from "lucide-react";
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
import { FavouriteItemsList } from "@/components/FavouriteItemsList";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className="h-screen">
      <div className="sticky top-0 border-b bg-background border-neutral-700 flex flex-col md:flex-row gap-6 md:items-center w-full p-4">
        <Link href="/">
          <div className="flex flex-row gap-4 items-center">
            <div className="text-title">
              <AnvilIcon />
            </div>
            <h1 className="text-base font-bold text-title">
              RuneScape: Dragonwilds
              <br />{" "}
              <span className="block -mt-1 text-xs font-normal">
                Crafting calculator
              </span>
            </h1>
          </div>
        </Link>
        <div className="grow flex flex-row justify-center md:justify-start items-center gap-4">
          <div className="w-full md:max-w-80">
            <SearchBox />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="group cursor-pointer">
                <StarIcon className="group-data-[state=open]:text-title group-data-[state=open]:fill-title" />
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

      <div className="h-full md:h-[calc(100vh-69px)]">{props.children}</div>
    </div>
  );
}
