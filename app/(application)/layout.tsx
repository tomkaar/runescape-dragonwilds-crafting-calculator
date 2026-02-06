import { SearchBox } from "@/components/SearchBox";
import { AnvilIcon, GithubIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

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
      <div className="sticky top-0 border-b bg-neutral-950 border-neutral-800 flex flex-col md:flex-row gap-6 md:items-center w-full p-4">
        <Link href="/">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <AnvilIcon />
            </div>
            <h1>
              Runescape: Dragonwilds
              <br />{" "}
              <span className="block -mt-1 text-xs">Crafting calculator</span>
            </h1>
          </div>
        </Link>
        <div className="grow flex flex-row justify-center md:justify-start items-center gap-4">
          <div className="w-full md:max-w-80">
            <SearchBox />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <StarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="favourites-popover-content"
            >
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

          <Link href={{ pathname: "/todo" }}>Todos</Link>
        </div>

        <div className="shrink-0 hidden md:block">
          <Link
            href="/"
            className="block border border-neutral-800 rounded-full p-1.5"
          >
            <GithubIcon size={20} />
          </Link>
        </div>
      </div>

      <div className="lg:h-[calc(100vh-69px)]">{props.children}</div>
    </div>
  );
}
