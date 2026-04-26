"use client";

import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { ListIcon } from "lucide-react";
import Link from "next/link";

export function ProgressEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold">No items tracked yet</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Browse items and mark materials as Todo or Done to start tracking your
          crafting progress.
        </p>
      </div>
      <div className="w-full max-w-sm flex flex-row flex-wrap gap-2">
        <div className="flex-1">
          <SearchBox />
        </div>

        <Link href="/item">
          <Button variant="outline">
            <ListIcon className="size-4" />
            All items
          </Button>
        </Link>
      </div>
    </div>
  );
}
