"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  itemId: string;
  itemName: string;
  children: ReactNode;
};

export function ItemQuickView({ itemId, itemName, children }: Props) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg gap-4">
        <DialogHeader className="sr-only">
          <DialogTitle>{itemName}</DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
