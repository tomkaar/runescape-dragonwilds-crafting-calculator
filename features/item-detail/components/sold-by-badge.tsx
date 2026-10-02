import { ShoppingCart } from "lucide-react";
import type { Store } from "@/Types";
import { StoreBadge } from "./store-badge";

type Props = {
	soldBy: Store[] | undefined;
};

export function SoldByBadge({ soldBy }: Props) {
	return <StoreBadge icon={ShoppingCart} title="Sold by" stores={soldBy} />;
}
