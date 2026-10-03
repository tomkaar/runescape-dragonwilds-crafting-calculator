"use client";

import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAddMarking } from "@/features/crafting-progress/hooks/useAddMarking";
import type { UnmarkedParents } from "@/features/crafting-progress/types/owned-material-entry";
import { MaterialPath } from "./material-path";

type Props = {
	materialName: string;
	unmarkedParents: UnmarkedParents[];
};

export function UnmarkedParentsDialog({
	materialName,
	unmarkedParents,
}: Props) {
	// Once every chain is marked the row's info — and this dialog with it —
	// unmounts.
	const addMarking = useAddMarking();

	return (
		<Dialog>
			<DialogTrigger
				aria-label="Show info"
				className="shrink-0 text-blue-500 hover:opacity-80"
			>
				<Info className="size-4" />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Info className="size-5 shrink-0 text-blue-500" />
						Owned stock can't reduce {materialName}
					</DialogTitle>
					<DialogDescription>
						{materialName} is marked, but these items above it aren't, so stock
						you already own of them doesn't lower how much {materialName} you
						need:
					</DialogDescription>
				</DialogHeader>
				<ul className="flex flex-col gap-2 text-sm">
					{unmarkedParents.map((entry) => (
						<li
							key={entry.path.map((s) => s.itemId).join(">")}
							className="flex flex-wrap items-center gap-1"
						>
							<MaterialPath path={entry.path} />
							<span className="ml-auto flex flex-wrap gap-1">
								{entry.unmarked.map((parent) => (
									<Button
										key={parent.nodeId}
										variant="outline"
										size="xs"
										onClick={() =>
											addMarking(
												entry.trackedItemId,
												parent.itemId,
												parent.nodeId,
											)
										}
									>
										<Plus />
										Mark {parent.name}
									</Button>
								))}
							</span>
						</li>
					))}
				</ul>
				<p className="text-sm text-muted-foreground">
					Mark them here or on the item card to enter how many you own.
				</p>
				<DialogFooter showCloseButton />
			</DialogContent>
		</Dialog>
	);
}
