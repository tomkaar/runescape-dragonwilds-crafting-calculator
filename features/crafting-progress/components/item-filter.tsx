"use client";

import { useMemo } from "react";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useItemFilter } from "@/store/item-filter";
import { sourceItemById } from "@/utils/source-item-by-id";

type Props = {
	trackedItemIds: string[];
	filteredItemIds: string[];
};

type ItemOption = { value: string; label: string; image: string | null };

export function ItemFilter({ trackedItemIds, filteredItemIds }: Props) {
	const setSelected = useItemFilter((state) => state.setSelected);
	const itemsAnchor = useComboboxAnchor();

	const itemOptions = useMemo(
		() =>
			trackedItemIds.reduce<ItemOption[]>((acc, id) => {
				const item = sourceItemById(id);
				if (item) acc.push({ value: id, label: item.name, image: item.image });
				return acc;
			}, []),
		[trackedItemIds],
	);

	return (
		<div className="bg-background rounded-lg border border-accent p-4 flex flex-col gap-3">
			<div>
				<h2 className="font-semibold text-sm">Filter</h2>
				<p className="text-xs text-muted-foreground mt-0.5">
					Choose which tracked items are included in the materials, next steps,
					facilities and experience below.
				</p>
			</div>

			<div className="flex flex-col gap-1">
				<Combobox
					multiple
					autoHighlight
					items={itemOptions}
					value={itemOptions.filter((o) => filteredItemIds.includes(o.value))}
					onValueChange={(values: ItemOption[], evt) => {
						evt.event.stopPropagation();
						setSelected(
							values.map((v) => v.value),
							trackedItemIds,
						);
					}}
					itemToStringValue={(item: ItemOption) => item.label}
				>
					<ComboboxChips ref={itemsAnchor} className="w-full">
						<ComboboxValue>
							{(values: ItemOption[]) => (
								<>
									{values.map(({ value, label, image }) => (
										<ComboboxChip key={value}>
											{image && (
												<img
													src={createImageUrlPath(image)}
													alt={label}
													width={14}
													height={14}
													className="shrink-0"
												/>
											)}
											{label}
										</ComboboxChip>
									))}
									<ComboboxChipsInput
										placeholder="Filter items…"
										className="text-xs"
									/>
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
					<ComboboxContent anchor={itemsAnchor}>
						<ComboboxEmpty>No items found.</ComboboxEmpty>
						<ComboboxList>
							{(option: ItemOption) => (
								<ComboboxItem
									key={option.value}
									value={option}
									className="text-xs"
								>
									{option.image && (
										<img
											src={createImageUrlPath(option.image)}
											alt={option.label}
											width={14}
											height={14}
											className="shrink-0"
										/>
									)}
									{option.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<span className="text-xs text-muted-foreground">
					{filteredItemIds.length} / {trackedItemIds.length} selected
				</span>
			</div>
		</div>
	);
}
