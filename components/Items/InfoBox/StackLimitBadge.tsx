import { Layers } from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

type Props = {
  stackLimit: number | undefined;
};

export function StackLimitBadge({ stackLimit }: Props) {
  if (stackLimit == null) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="text-sm cursor-default">
            <Layers size={20} /> {stackLimit}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-84">
          <span className="font-semibold">Stack limit</span>
          <br />
          The maximum number of this item that can be held in a single inventory
          or chest slot.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
