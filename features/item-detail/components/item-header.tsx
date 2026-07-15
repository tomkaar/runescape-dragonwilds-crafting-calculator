import { Favourite } from "@/features/favourites/components/favourite-button";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { Item } from "@/Types";

type Props = {
	item: Pick<Item, "name" | "image">;
	itemId: string;
};

export function ItemHeader({ item, itemId }: Props) {
	return (
		<div className="flex flex-row gap-4 items-center pr-2">
			<div className="grow flex flex-row items-center gap-2">
				{item.image && (
					<img
						src={createImageUrlPath(item.image, 64)}
						alt={item.name}
						width={40}
						height={40}
					/>
				)}
				<h2 className="text-white font-bold">{item.name}</h2>
			</div>
			<Favourite itemId={itemId} />
		</div>
	);
}
