import { BicepsFlexed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
	sustenance: number | undefined;
};

export function SustenanceBadge({ sustenance }: Props) {
	if (sustenance == null) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="secondary" className="text-sm cursor-default">
						<BicepsFlexed size={20} /> {sustenance}
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-60">
					<span className="font-semibold">Sustenance</span>
					<br />
					How much sustenance this item restores when consumed.
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
