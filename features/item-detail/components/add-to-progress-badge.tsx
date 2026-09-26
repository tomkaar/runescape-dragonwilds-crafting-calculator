"use client";

import { CheckIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";

type Props = {
	itemId: string;
};

export function AddToProgressBadge({ itemId }: Props) {
	const _hasHydrated = useStoreHydration(useSelectedMaterial);
	const isTracked = useSelectedMaterial((state) => itemId in state.items);
	const trackItem = useSelectedMaterial((state) => state.trackItem);

	if (_hasHydrated && isTracked) {
		return (
			<Badge asChild variant="default" className="text-sm">
				<Link href="/progress" prefetch={false}>
					<CheckIcon />
					In progress
				</Link>
			</Badge>
		);
	}

	return (
		<Badge
			asChild
			variant="default"
			className="text-sm cursor-pointer disabled:cursor-default disabled:opacity-50"
		>
			<button
				type="button"
				disabled={!_hasHydrated}
				onClick={() => trackItem(itemId)}
			>
				<PlusIcon />
				Add to progress
			</button>
		</Badge>
	);
}
