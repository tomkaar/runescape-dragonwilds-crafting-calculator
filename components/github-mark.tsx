import { cn } from "@/lib/utils";

type Props = {
	size?: number;
	className?: string;
};

/** The GitHub mark, inverted for the dark UI. Shared between desktop and mobile nav. */
export function GitHubMark({ size = 20, className }: Props) {
	return (
		<img
			src="/github.svg"
			alt=""
			width={size}
			height={size}
			className={cn("invert", className)}
		/>
	);
}
