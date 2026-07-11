"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ListChecksIcon, ListIcon, StarIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

import itemJSON from "@/data/items.json";
import { Item } from "@/Types"
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url"
import { useVirtualizer } from "@tanstack/react-virtual"
import { matchSorter } from "match-sorter"
import { useRouter } from "next/navigation"
import { useFavouriteItems } from "@/store/favourite-items"
import { sourceItemById } from "@/utils/source-item-by-id"
import { cn } from "@/lib/utils"
const items = itemJSON.sort((a, b) => a.name.localeCompare(b.name)) as Item[];

type Page = "favourites" | null

const navigationCommands = [
  { id: "favourites", name: "Favourites", icon: StarIcon, shortcut: "⇧F" },
  { id: "all-items", name: "All items", icon: ListIcon, shortcut: "⇧I" },
  { id: "progress", name: "Progress", icon: ListChecksIcon, shortcut: "⇧P" },
]

const ROW_HEIGHT = 40;

type Props = {
  buttonClassName?: string;
}

export function CommandWithShortcuts({ buttonClassName = ""}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("");
  const [page, setPage] = useState<Page>(null);

  const router = useRouter();
  const favouriteItemIds = useFavouriteItems((state) => state.items);

  const parentRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["k", "K"].includes(e.key) && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        return
      }
      if (["p", "P"].includes(e.key) && e.shiftKey) {
        e.preventDefault()
        router.push("/progress")
        return
      }
      if (["i", "I"].includes(e.key) && e.shiftKey) {
        e.preventDefault()
        router.push("/item")
        return
      }
      if (["f", "F"].includes(e.key) && e.shiftKey) {
        e.preventDefault()
        setPage("favourites")
        setOpen(true)
        return
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Reset transient state whenever the dialog closes, so it always reopens on the root page
  useEffect(() => {
    if (open) return;
    setQuery("");
    setPage(null);
  }, [open]);

  const favouritedItems = useMemo(() => {
    return favouriteItemIds
      .map((id) => sourceItemById(id))
      .filter((item): item is Item => item !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [favouriteItemIds]);

  const sourceItems = page === "favourites" ? favouritedItems : items;

  const filteredItems = useMemo(() => {
      if (!query) return sourceItems;
      return matchSorter(sourceItems, query, { keys: ["name"] });
    }, [query, sourceItems]);

  const filteredNavigation = useMemo(() => {
      if (page) return [];
      if (!query) return navigationCommands;
      return matchSorter(navigationCommands, query, { keys: ["name"] });
    }, [query, page]);

  // The virtualized list shares a scroll container with the static
  // "Navigate" group above it, so the virtualizer needs to know how far
  // down the sizer div sits before its offsets line up with real scroll position.
  const [scrollMargin, setScrollMargin] = useState(0);
  useLayoutEffect(() => {
    setScrollMargin(sizerRef.current?.offsetTop ?? 0);
  }, [open, query, page]);

  const rowVirtualizer = useVirtualizer({
      count: filteredItems.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => ROW_HEIGHT,
      overscan: 8,
      scrollMargin,
    });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Measure the virtualizer when the dropdown opens to ensure correct item sizes
  // without this, the virtualizer may not calculate sizes correctly until the user interacts with the list
  // resulting in displaying a blank list
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => rowVirtualizer.measure());
    return () => cancelAnimationFrame(id);
  }, [open, rowVirtualizer]);

  const goToFavourites = () => {
    setPage("favourites");
    setQuery("");
    rowVirtualizer.scrollToOffset(0);
  };

  const goBack = () => {
    setPage(null);
    setQuery("");
    rowVirtualizer.scrollToOffset(0);
  };

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const emptyMessage =
    page === "favourites" && favouritedItems.length === 0
      ? "No favourited items yet. Star an item to add it here."
      : filteredNavigation.length === 0 && filteredItems.length === 0
        ? "No results found."
        : null;

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className={cn("w-full lg:w-fit", buttonClassName)}>
        <span className="text-muted-foreground">⌘K</span> Search and navigate
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        onEscapeKeyDown={(e) => {
          // Radix's own Escape handling runs before React's onKeyDown reaches
          // the Command element, so going back a page has to be intercepted here.
          if (page) {
            e.preventDefault()
            goBack()
          }
        }}
      >
        <Command
          shouldFilter={false}
          onKeyDown={(e) => {
            if (page && e.key === "Backspace" && !query) {
              e.preventDefault()
              goBack()
            }
          }}
        >
          <CommandInput
            placeholder={
              page === "favourites"
                ? "Search your favourites..."
                : "Type a command or search..."
            }
            value={query}
            onValueChange={(value) => {
              setQuery(value)
              rowVirtualizer.scrollToOffset(0)
            }}
          />
          <CommandList ref={parentRef} className="relative">
            {emptyMessage && (
              <div className="py-6 text-center text-sm">{emptyMessage}</div>
            )}

            {page === null && filteredNavigation.length > 0 && (
              <CommandGroup heading="Navigate">
                {filteredNavigation.map((command) => (
                  <CommandItem
                    key={command.id}
                    value={command.id}
                    onSelect={() => {
                      if (command.id === "favourites") {
                        goToFavourites()
                      } else if (command.id === "all-items") {
                        navigateTo("/item")
                      } else if (command.id === "progress") {
                        navigateTo("/progress")
                      }
                    }}
                  >
                    <command.icon />
                    <span>{command.name}</span>
                    <CommandShortcut>{command.shortcut}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredItems.length > 0 && (
              <CommandGroup heading={page === "favourites" ? "Favourites" : "Items"}>
                <div
                  ref={sizerRef}
                  style={{
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualItems.map(virtualItem => {
                    const item = filteredItems[virtualItem.index];
                    if (!item) return null;

                    return (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => navigateTo(`/item/${item.id}`)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: virtualItem.size,
                          transform: `translateY(${virtualItem.start - scrollMargin}px)`,
                        }}
                      >
                        <div className="flex flex-row gap-2 items-center">
                          {item.image && (
                            <img
                              src={createImageUrlPath(item.image)}
                              alt={item.name}
                              width={28}
                              height={28}
                            />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
