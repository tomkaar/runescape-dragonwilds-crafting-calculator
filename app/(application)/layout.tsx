import { ProgressNavLink } from "@/components/Progress/ProgressNavLink";
import {
  AnvilIcon,
  CheckCircleIcon,
  GithubIcon,
  HomeIcon,
  ListIcon,
  MenuIcon,
  Scale,
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LastSynced } from "@/components/LastSynced/LastSynced";
import { CommandWithShortcuts } from "@/features/command/components/command-with-shortcuts";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className="h-screen">
      <div className="sticky top-0 z-10 border-b bg-background border-border flex flex-col md:flex-row gap-6 md:items-center w-full p-4">
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

        <div className="grow flex flex-row justify-center md:justify-start items-center gap-4">
          <div className="md:max-w-120">
            <CommandWithShortcuts />
          </div>
          <Link href="/item">
            <Button variant="outline" size="sm">
              <span className="text-muted-foreground">⇧I</span>
              <span className="sr-only">All items</span>
              <ListIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="outline" size="sm">
              <span className="text-muted-foreground">⇧P</span>
              <span className="sr-only">Progress</span>
              <CheckCircleIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="shrink-0 hidden md:flex gap-2 flex-row items-center">
          <div className="hidden md:block">
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

      <div className="md:h-[calc(100vh-69px)]">{props.children}</div>
    </div>
  );
}
