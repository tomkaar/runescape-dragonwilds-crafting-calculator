import { HandCoins } from "lucide-react";
import type { Store } from "@/Types";
import { StoreBadge } from "./store-badge";

type Props = {
	boughtBy: Store[] | undefined;
};

export function BoughtByBadge({ boughtBy }: Props) {
	return <StoreBadge icon={HandCoins} title="Bought by" stores={boughtBy} />;
}
