import type { Metadata } from "next";
import { ItemTable } from "@/components/ItemTable/ItemTable";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Items | Dragonwilds Crafting Calculator",
		description:
			"Calculate the materials needed to craft items in Runescape: Dragonwilds",
	};
}

export default function ItemPage() {
	return (
		<main className="h-full flex flex-col">
			<ItemTable />
		</main>
	);
}
