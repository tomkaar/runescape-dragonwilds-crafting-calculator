import Link from "next/link";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { getUsedIn } from "@/utils/getUsedIn";

type Props = {
	usedIn: ReturnType<typeof getUsedIn>;
};

export function UsedInList({ usedIn }: Props) {
	return (
		<ul className="flex flex-col flex-wrap">
			{usedIn.length === 0 && (
				<li className="text-sm text-muted-foreground">
					Not used in any recipes
				</li>
			)}
			{usedIn
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((item) => (
					<li key={item.id}>
						<Link
							href={{ pathname: `/item/${item.id}` }}
							prefetch={false}
							className="text-sm pr-2 pl-2 py-1 flex flex-row gap-2 items-center hover:bg-accent hover:text-accent-foreground rounded-lg"
						>
							{item.image && (
								<img
									src={createImageUrlPath(item.image)}
									width={24}
									height={24}
									alt={item.name}
									data-icon="inline-start"
								/>
							)}
							{item.name}
						</Link>
					</li>
				))}
		</ul>
	);
}
