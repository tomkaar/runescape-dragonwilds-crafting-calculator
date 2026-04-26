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
import { Suspense } from "react";
import LastSyncDate from "./LastSyncDate";

export function LastSynced() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-left text-xs text-muted-foreground gap-3 whitespace-nowrap justify-start"
        >
          <CalendarIcon size={14} />
          <span>
            <span className="font-semibold text-foreground">Last synced</span>{" "}
            <br />
            <Suspense fallback="Loading...">
              <LastSyncDate format="short" />
            </Suspense>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Data last synced</DialogTitle>
          <DialogDescription asChild>
            <span className="text-xs text-foreground">
              <span className="block">
                Last synced:{" "}
                <Suspense fallback="Loading...">
                  <LastSyncDate format="short" />
                </Suspense>
              </span>
              <span className="block mt-2">
                This date reflects when the data was last synced in this
                application. Data is automatically fetched and parsed daily from
                the RuneScape: Dragonwilds Wiki using their public bucket API.
              </span>
              <span className="block mt-2">
                Data in this application may not always be fully accurate.
                Please verify with official sources.
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
