"use client";

import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  date: string;
};

export function LastUpdated({ date }: Props) {
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer text-left text-xs text-muted-foreground gap-3 whitespace-nowrap justify-start"
        >
          <CalendarIcon size={14} />
          <span>
            <span className="font-semibold text-foreground">Last updated</span>{" "}
            <br />
            {formatted}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Data last updated</DialogTitle>
          <DialogDescription asChild>
            <span className="text-xs text-neutral-200">
              <span className="block mt-2">
                The last updated date ({formatted}) reflects when game data was
                last automatically fetched from the RuneScape: Dragonwilds Wiki.
              </span>
              <span className="block mt-2">
                Data is fetched daily. The data in this application may not
                always be accurate or up-to-date — please verify with official
                sources.
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
