import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/Types";
import { HealthBadge } from "./health-badge";
import { HydrationBadge } from "./hydration-badge";
import { StackLimitBadge } from "./stack-limit-badge";
import { SustenanceBadge } from "./sustenance-badge";
import { WeightBadge } from "./weight-badge";

type Props = {
	item: Pick<
		Item,
		"wikiLink" | "weight" | "health" | "stackLimit" | "hydration" | "sustenance"
	>;
	/** Rendered immediately after the wiki badge, before the weight/health/stack-limit badges. */
	afterWiki?: ReactNode;
};

export function ItemAttributeBadges({ item, afterWiki }: Props) {
	return (
		<>
			{item.wikiLink && (
				<Badge asChild variant="outline" className="text-sm">
					<Link
						href={{
							pathname: `https://dragonwilds.runescape.wiki/w/${item.wikiLink}`,
						}}
						prefetch={false}
						target="_blank"
						rel="noopener noreferrer"
					>
						Wiki
						<ArrowUpRight width={12} height={12} data-icon="inline-end" />
					</Link>
				</Badge>
			)}

			{afterWiki}

			<WeightBadge weight={item.weight} />
			<HealthBadge health={item.health} />
			<HydrationBadge hydration={item.hydration} />
			<SustenanceBadge sustenance={item.sustenance} />
			<StackLimitBadge stackLimit={item.stackLimit} />
		</>
	);
}
