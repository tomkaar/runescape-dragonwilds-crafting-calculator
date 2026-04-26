"use client";

import Link from "next/link";
import { ListChecksIcon } from "lucide-react";

import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onClick?: () => void;
};

export function ProgressNavLink({ className, onClick }: Props) {
  const items = useSelectedMaterial((state) => state.items);
  const count = Object.values(items).filter(
    (materials) => materials.length > 0,
  ).length;

  return (
    <Link
      href="/progress"
      className={cn("relative", className)}
      onClick={onClick}
    >
      <ListChecksIcon size={16} />
      <span>
        Progress
        {count > 0 && (
          <span className="ml-1 bg-title text-black text-xs rounded-full px-1.5 py-0.5 leading-none font-medium">
            {count}
          </span>
        )}
      </span>
    </Link>
  );
}
