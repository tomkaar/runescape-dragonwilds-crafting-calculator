import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
	health: number | undefined;
};

export function HealthBadge({ health }: Props) {
	if (health == null) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="secondary" className="text-sm cursor-default">
						<Heart size={20} /> {health}
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-60">
					<span className="font-semibold">Health</span>
					<br />
					How much health this item restores when consumed or used.
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
