import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import type { MaterialPathSegment } from "@/features/crafting-progress/types/owned-material-entry";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

/** Renders a path through a tracked item's material tree as "A › B › C". */
export function MaterialPath({ path }: { path: MaterialPathSegment[] }) {
	return path.map((segment, i) => (
		<Fragment
			key={path
				.slice(0, i + 1)
				.map((s) => s.itemId)
				.join(">")}
		>
			{i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
			<span className="flex items-center gap-1">
				{segment.image && (
					<img
						src={createImageUrlPath(segment.image)}
						alt={segment.name}
						width={16}
						height={16}
						className="shrink-0"
					/>
				)}
				{segment.name}
			</span>
		</Fragment>
	));
}
