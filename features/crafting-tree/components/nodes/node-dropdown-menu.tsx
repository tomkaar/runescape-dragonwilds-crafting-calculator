"use client";

import { ArrowRight, Ellipsis, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import itemsData from "@/data/items.json";
import { useTrackedMaterialToggle } from "@/hooks/useTrackedMaterialToggle";
import type { Item } from "@/Types";

type NodeDropdownMenuProps = {
	id: string;
	nodeId: string;
	initialItemId: string;
	quantity: number;
};

export function NodeDropdownMenu({
	id,
	nodeId,
	initialItemId,
	quantity,
}: NodeDropdownMenuProps) {
	const { added, add, remove } = useTrackedMaterialToggle({
		initialItemId,
		nodeId,
		itemId: id,
		quantity,
	});

	const item = itemsData.find(
		(item) => item.id.toLowerCase() === id.toLowerCase(),
	) as Item | undefined;
	const wikiLink = item?.wikiLink;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
					type="button"
				>
					<Ellipsis className="size-3.5" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-40">
				<DropdownMenuLabel>Check</DropdownMenuLabel>
				<DropdownMenuItem onClick={add} disabled={!!added}>
					<Plus className="size-4" />
					Add to tracking
				</DropdownMenuItem>
				<DropdownMenuItem onClick={remove} disabled={!added}>
					<div className="size-4" />
					Clear
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>See more</DropdownMenuLabel>
				<DropdownMenuItem asChild>
					<Link href={{ pathname: `/item/${id}` }} prefetch={false}>
						<ArrowRight className="size-4" />
						View item
					</Link>
				</DropdownMenuItem>
				{item?.name && (
					<DropdownMenuItem asChild>
						<a href={`/item?materials=${encodeURIComponent(item.name)}`}>
							<ArrowRight className="size-4" />
							Items using this
						</a>
					</DropdownMenuItem>
				)}
				{wikiLink && (
					<DropdownMenuItem asChild>
						<a
							href={`https://dragonwilds.runescape.wiki/w/${encodeURIComponent(wikiLink)}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="size-4" />
							View on Wiki
						</a>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
