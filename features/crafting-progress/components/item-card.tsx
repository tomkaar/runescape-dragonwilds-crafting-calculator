"use client";

import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { RequiredMaterialsContent } from "@/features/material-tree/components/required-materials-content";
import { useClampedNumberInput } from "@/hooks/useClampedNumberInput";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import type { Item } from "@/Types";

type Props = {
	itemId: string;
	item: Item;
};

export function ItemCard({ itemId, item }: Props) {
	const clearMarkedMaterials = useSelectedMaterial(
		(state) => state.clearMarkedMaterials,
	);

	const multipliers = useMaterialMultiplier((state) => state.items);
	const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
	const multiplier = multipliers[itemId] || 1;

	const { inputValue, onChange, onBlur } = useClampedNumberInput({
		value: multiplier,
		onCommit: (parsed) => setMultiplier(itemId, parsed),
		min: 1,
		max: 1000,
	});

	return (
		<AccordionItem
			value={`progress-${itemId}`}
			className="bg-background rounded-lg border border-accent"
		>
			<AccordionTrigger className="text-foreground px-4">
				<div className="flex flex-row items-center gap-3">
					{item.image && (
						<img
							src={createImageUrlPath(item.image)}
							alt={item.name}
							width={24}
							height={24}
							className="shrink-0"
						/>
					)}
					<div className="flex flex-col text-left">
						<span>{item.name}</span>
						<span className="text-xs text-muted-foreground font-normal">
							Multiplier: {multiplier}x
						</span>
					</div>
				</div>
			</AccordionTrigger>

			<AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4 pt-4">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="cursor-pointer"
						asChild
					>
						<Link href={`/item/${itemId}`} prefetch={false}>
							<ChevronRight className="size-4" />
						</Link>
					</Button>
					<InputGroup className="w-24">
						<InputGroupInput
							type="number"
							autoComplete="off"
							placeholder="Multiplier"
							value={inputValue}
							onChange={onChange}
							onBlur={onBlur}
						/>
						<InputGroupAddon align="inline-end">×</InputGroupAddon>
					</InputGroup>
					<ConfirmAlertDialog
						trigger={
							<Button
								variant="outline"
								size="sm"
								className="ml-auto text-destructive hover:text-destructive"
							>
								<Trash2 className="size-4" />
								<span className="hidden md:inline lg:hidden xl:inline">
									Remove
								</span>
							</Button>
						}
						title={`Remove ${item.name} from progress?`}
						description={`This will clear all tracked materials for ${item.name}. This action cannot be undone.`}
						confirmLabel="Remove"
						onConfirm={() => clearMarkedMaterials(itemId)}
					/>
				</div>

				<RequiredMaterialsContent itemId={itemId} skipFirstLayer />
			</AccordionContent>
		</AccordionItem>
	);
}
