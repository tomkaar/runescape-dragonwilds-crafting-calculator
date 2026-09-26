"use client";

import {
	ArrowRight,
	ChevronDown,
	Ellipsis,
	ExternalLink,
	ListChecks,
	ListX,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCraftingTreeHover } from "@/features/crafting-tree/context/crafting-tree-hover";
import { useTrackedMaterialsToggle } from "@/hooks/useTrackedMaterialsToggle";
import { useTrackedMaterialToggle } from "@/hooks/useTrackedMaterialToggle";
import { cn } from "@/lib/utils";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { MaterialTreeItem } from "../types/material-tree";

type TreeNodeMaterial = {
	nodeId: string;
	itemId: string;
	quantity: number;
};

function SelectMaterialsMenuItem({
	initialItemId,
	materials,
}: {
	initialItemId: string;
	materials: TreeNodeMaterial[];
}) {
	const { allSelected, toggle } = useTrackedMaterialsToggle({
		initialItemId,
		materials,
	});

	return (
		<DropdownMenuItem onSelect={toggle}>
			{allSelected ? (
				<ListX className="size-4" />
			) : (
				<ListChecks className="size-4" />
			)}
			{allSelected ? "Deselect materials" : "Select materials"}
		</DropdownMenuItem>
	);
}

function TreeNodeNavigateMenu({
	itemId,
	wikiLink,
	initialItemId,
	materials,
}: {
	itemId?: string;
	wikiLink?: string;
	initialItemId: string;
	materials?: TreeNodeMaterial[];
}) {
	const hasMaterials = !!materials && materials.length > 0;
	const hasLinks = !!itemId || !!wikiLink;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
					type="button"
					aria-label="Item options"
				>
					<Ellipsis className="size-3.5" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-40">
				{hasMaterials && (
					<SelectMaterialsMenuItem
						initialItemId={initialItemId}
						materials={materials}
					/>
				)}
				{hasMaterials && hasLinks && <DropdownMenuSeparator />}
				{itemId && (
					<DropdownMenuItem asChild>
						<Link href={{ pathname: `/item/${itemId}` }} prefetch={false}>
							<ArrowRight className="size-4" />
							View item
						</Link>
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

function hasCheckedDescendant(
	node: MaterialTreeItem,
	items: Array<{ nodeId?: string }>,
): boolean {
	if (!("children" in node) || node.children.length === 0) return false;
	return node.children.some(
		(child) =>
			items.some((i) => i.nodeId === child.nodeId) ||
			hasCheckedDescendant(child, items),
	);
}

export function MaterialTreeNode({
	item,
	initialItemId,
	baseQuantities,
}: {
	item: MaterialTreeItem;
	initialItemId: string;
	baseQuantities: Map<string, number>;
}) {
	const { enter, reset } = useCraftingTreeHover();
	const { items, added, toggle } = useTrackedMaterialToggle({
		initialItemId,
		nodeId: item.nodeId,
		itemId: item.id,
		quantity: baseQuantities.get(item.nodeId) ?? item.quantity,
	});

	const anyDescendantChecked = hasCheckedDescendant(item, items);

	const [manualOpen, setManualOpen] = useState(
		item.nodeId === initialItemId || anyDescendantChecked,
	);

	const handleToggleItem = (e?: React.SyntheticEvent) => {
		e?.stopPropagation();
		toggle();
	};

	const checkboxId = `material-checkbox-${item.nodeId}`;
	const checkboxState = !!added;

	if ("children" in item && item.children.length > 0) {
		// A selector node's children are recipe variants, not materials, so it
		// gets no "Select materials" option — each variant row gets its own.
		const isSelector = item.children.some(
			(child) => child.variantNumber !== undefined,
		);
		const materials = isSelector
			? undefined
			: item.children.map((child) => ({
					nodeId: child.nodeId,
					itemId: child.id,
					quantity: baseQuantities.get(child.nodeId) ?? child.quantity,
				}));

		return (
			<Collapsible
				key={item.nodeId}
				open={manualOpen || anyDescendantChecked}
				onOpenChange={setManualOpen}
			>
				<div className="flex flex-row gap-2 items-center">
					{item.variantNumber === undefined && (
						<Checkbox onClick={handleToggleItem} checked={checkboxState} />
					)}

					<CollapsibleTrigger className="flex-1">
						{/** biome-ignore lint/a11y/noStaticElementInteractions: <known issue> */}
						<div
							className={cn(
								"flex flex-row gap-2 items-center pr-2 pl-2 py-0.5 rounded-lg text-sm group hover:bg-accent w-full justify-start transition-none",
								item.variantNumber !== undefined ? "pl-2 py-0.5" : "",
							)}
							onMouseEnter={() => enter(item.nodeId)}
							onMouseLeave={() => reset()}
							onFocus={() => enter(item.nodeId)}
							onBlur={() => reset()}
						>
							{item.item.image && item.variantNumber === undefined && (
								<img
									src={createImageUrlPath(item.item.image)}
									alt={item.item.name}
									width={24}
									height={24}
								/>
							)}
							{item.variantNumber === undefined && (
								<span className="font-semibold text-foreground">
									{item.quantity}x
								</span>
							)}
							{item.variantNumber === undefined && (
								<span className="text-left">{item.item.name}</span>
							)}
							{item.variantNumber !== undefined && (
								<span className="text-title">Recipe {item.variantNumber}</span>
							)}

							<ChevronDown className="w-4 h-4 self-center justify-self-end ml-auto text-muted-foreground group-hover:text-foreground" />
						</div>
					</CollapsibleTrigger>
					{item.variantNumber === undefined ? (
						<TreeNodeNavigateMenu
							itemId={item.id}
							wikiLink={item.item.wikiLink}
							initialItemId={initialItemId}
							materials={materials}
						/>
					) : (
						<TreeNodeNavigateMenu
							initialItemId={initialItemId}
							materials={materials}
						/>
					)}
				</div>

				<div className="pl-2">
					<CollapsibleContent
						className={cn(
							"border-l border-border pl-2",
							item.variantNumber !== undefined && "border-title ml-2",
						)}
					>
						<div className="flex flex-col pl-2">
							{item.children.map((child) => (
								<MaterialTreeNode
									key={child.nodeId}
									item={child}
									initialItemId={initialItemId}
									baseQuantities={baseQuantities}
								/>
							))}
						</div>
					</CollapsibleContent>
				</div>
			</Collapsible>
		);
	}

	return (
		<FieldGroup key={item.nodeId} className="w-full">
			<fieldset
				data-slot="field"
				data-orientation="horizontal"
				className="flex flex-row gap-2 items-center"
			>
				<Checkbox
					id={checkboxId}
					checked={checkboxState}
					onCheckedChange={() => handleToggleItem()}
				/>
				<FieldContent>
					<FieldLabel
						htmlFor={checkboxId}
						className="flex flex-row gap-2 items-center px-2 py-1 rounded-lg text-sm text-foreground w-full justify-start transition-colors hover:bg-accent hover:text-accent-foreground"
						onMouseEnter={() => enter(item.nodeId)}
						onMouseLeave={() => reset()}
						onFocus={() => enter(item.nodeId)}
						onBlur={() => reset()}
					>
						{item.item.image && (
							<img
								src={createImageUrlPath(item.item.image)}
								alt={item.item.name}
								width={24}
								height={24}
							/>
						)}
						<span className="font-semibold">{item.quantity}x</span>
						<span className="text-left">{item.item.name}</span>
						{item.variantNumber && (
							<span className="text-muted-foreground">
								(Recipe {item.variantNumber})
							</span>
						)}
					</FieldLabel>
				</FieldContent>
				<TreeNodeNavigateMenu
					itemId={item.id}
					wikiLink={item.item.wikiLink}
					initialItemId={initialItemId}
				/>
			</fieldset>
		</FieldGroup>
	);
}
