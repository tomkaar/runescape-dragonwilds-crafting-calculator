import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";

export function Facilities({ facilities }: { facilities: string[] }) {
  if (facilities.length === 0) return null;

  if (facilities.length === 1) {
    const facility = facilities[0];
    return (
      <div className="w-full flex flex-wrap gap-2 text-xs text-foreground bg-card px-2 py-1 rounded-lg">
        <span className="flex items-center gap-2">
          {getFacilityIcon(facility as (typeof Facility)[number])}
          {facility}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-1.5 justify-center bg-card px-2 py-1 rounded-lg items-center">
      <span className="text-xs text-foreground">One of: </span>
      {facilities.map((facility) => (
        <TooltipProvider key={facility}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center size-6 rounded-full bg-secondary border border-border cursor-default">
                {getFacilityIcon(facility as (typeof Facility)[number], 20)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">{facility}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}