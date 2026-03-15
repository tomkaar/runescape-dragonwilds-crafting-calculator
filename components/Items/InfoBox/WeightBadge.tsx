import { Weight } from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

type Props = {
  weight: number | undefined;
};

export function WeightBadge({ weight }: Props) {
  if (weight == null) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="text-sm cursor-default">
            <Weight size={20} /> {weight}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-84">
          <span className="font-semibold">Weight</span>
          <br />
          How much this item contributes to your inventory load. The higher the
          weight, the more it will slow you down.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
