import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
	title: string;
	/** Icon shown to the left of the header title in the accordion trigger. */
	headerIcon?: LucideIcon;
	/** Short hint shown under the title, e.g. explaining what the filter does. */
	description?: string;
	badge?: ReactNode;
};

export default function FilterAccordionHeader({
	title,
	headerIcon: HeaderIcon,
	description,
	badge,
}: Props) {
	return (
		<div className="flex flex-row gap-2">
			{HeaderIcon ? (
				<HeaderIcon className="h-4 w-4 mt-0.5 shrink-0 text-accent-foreground" />
			) : null}
			<div>
				<div className="flex flex-row gap-2 items-center">
					<span className="text-accent-foreground">{title}</span>
					{badge}
				</div>
				{description ? (
					<span className="block text-muted-foreground text-xs leading-3.5 pb-1">
						{description}
					</span>
				) : null}
			</div>
		</div>
	);
}
