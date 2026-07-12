import { Panel } from "@xyflow/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccordionPersisted } from "@/components/Items/AccordionPersisted";
import { ItemInfoBox } from "@/components/Items/InfoBox/InfoBox";
import { CraftingTree } from "@/features/crafting-tree/components/crafting-tree";
import { sourceItemById } from "@/utils/source-item-by-id";
import { AccordionCraftingTree } from "../../../../components/Items/CraftingTree/CraftingTree";
import { AccordionMaterials } from "../../../../components/Items/Materials/Materials";
import { AccordionUsedIn } from "../../../../components/Items/UsedIn/UsedIn";
import { ClearSelected } from "../../../../features/crafting-tree/components/actions/clear-selected";
import { Direction } from "../../../../features/crafting-tree/components/actions/direction";

type Props = {
	params: Promise<{ itemId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { itemId } = await props.params;
	const item = sourceItemById(itemId);

	return {
		title: [item?.name, "Dragonwilds Crafting Calculator"]
			.filter((s) => s !== null && s !== undefined)
			.join(" | "),
		description:
			"Calculate the materials needed to craft items in Runescape: Dragonwilds",
	};
}

export default async function ItemPage(props: Props) {
	const { itemId } = await props.params;

	const item = sourceItemById(itemId);

	if (item === undefined) {
		notFound();
	}

	return (
		<main className="lg:h-full flex flex-col">
			<div className="w-full flex flex-col gap-4 lg:hidden px-4 py-4">
				<div className="sticky top-0 bg-background border border-accent rounded-lg">
					<ItemInfoBox item={item} itemId={itemId} />
				</div>

				<AccordionPersisted className="flex flex-col gap-2 pb-2">
					<AccordionMaterials itemId={itemId} />
					<AccordionUsedIn itemId={itemId} />
					<AccordionCraftingTree itemId={itemId} />
				</AccordionPersisted>
			</div>

			<div className="lg:h-full w-full hidden lg:block">
				<CraftingTree itemId={itemId} treePaddingLeft={440}>
					<Panel position="top-left" className="flex gap-2 pl-104">
						<ClearSelected itemId={itemId} />
						<Direction />
					</Panel>

					<Panel
						position="top-left"
						className="h-full flex flex-col gap-4 overflow-scroll w-100"
					>
						<div className="sticky top-0 bg-background border border-accent rounded-lg">
							<ItemInfoBox item={item} itemId={itemId} />
						</div>

						<div className="overflow-scroll rounded-lg flex flex-col gap-4 pb-8">
							<AccordionPersisted className="flex flex-col gap-2 pb-2">
								<AccordionMaterials itemId={itemId} />
								<AccordionUsedIn itemId={itemId} />
							</AccordionPersisted>
						</div>
					</Panel>
				</CraftingTree>
			</div>
		</main>
	);
}
