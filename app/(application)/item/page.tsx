import type { Metadata } from "next";
import { Suspense } from "react";
import Table from "@/features/table/components/table";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Items | Dragonwilds Crafting Calculator",
		description:
			"Calculate the materials needed to craft items in Runescape: Dragonwilds",
	};
}

export default function ItemPage() {
	return (
		<Suspense>
			<Table />
		</Suspense>
	);
}
