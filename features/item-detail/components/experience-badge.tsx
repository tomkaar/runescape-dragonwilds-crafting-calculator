import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { resolveItemExperience } from "@/domain/crafting/utils/resolve-item-experience";
import type { ItemVariant } from "@/Types";
import { getSkillImageUrl } from "@/utils/getSkillImageUrl";

type Props = {
	variants: ItemVariant[];
};

export function ExperienceBadge({ variants }: Props) {
	const experience = resolveItemExperience(variants);
	if (experience == null) return null;

	const { skill, min, max } = experience;
	const isRange = min !== max;
	const label = isRange ? `${min}-${max} XP` : `${min} XP`;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="secondary" className="text-sm cursor-default">
						<img
							src={getSkillImageUrl(skill)}
							alt={skill}
							width={20}
							height={20}
							className="shrink-0"
						/>
						{label}
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-84">
					<span className="font-semibold">{skill} experience</span>
					<br />
					{isRange
						? `How much ${skill} experience crafting this item grants. Shown as a range because its variants grant different amounts — the style you craft decides where in ${min}-${max} XP you land.`
						: `How much ${skill} experience crafting this item grants.`}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
