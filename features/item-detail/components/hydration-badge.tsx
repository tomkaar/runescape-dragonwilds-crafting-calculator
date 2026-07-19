import { Droplet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
	hydration: number | undefined;
};

export function HydrationBadge({ hydration }: Props) {
	if (hydration == null) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="secondary" className="text-sm cursor-default">
						<Droplet size={20} /> {hydration}
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-60">
					<span className="font-semibold">Hydration</span>
					<br />
					How much hydration this item restores when consumed.
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
