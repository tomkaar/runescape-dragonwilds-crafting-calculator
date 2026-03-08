"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { Facility } from "@/Types";

type Props = {
  facilities: string[];
};

export function CraftingFacilitiesPopover({ facilities }: Props) {
  if (facilities.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="secondary"
          className="text-sm cursor-pointer select-none"
        >
          +{facilities.length}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex flex-col gap-0.5">
          {facilities.map((facility) => (
            <Link
              key={facility}
              href={{
                pathname: `/item`,
                search: `?facility=${encodeURIComponent(facility)}`,
              }}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-neutral-700 transition-colors"
            >
              {getFacilityIcon(facility as (typeof Facility)[number], 20)}
              {facility}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
