import type { Column, Table } from "@tanstack/react-table";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { TableBodyRowType } from "../types/table-body-row";

type Props = {
	showMoreButton?: boolean;
	showFacilityIcon?: boolean;
	table: Table<TableBodyRowType>;
	column: Column<TableBodyRowType, unknown>;
};

export default function FilterRange({ column }: Props) {
	const columnFilterValue = column.getFilterValue();
	const uniqueKeys = getUniqueKeys(column);
	const max = Math.max(...uniqueKeys.map((key) => Number(key.name)), 0);
	const min = Math.min(...uniqueKeys.map((key) => Number(key.name)), 0);

	const activeFilterString = activeFilterToString(columnFilterValue, min, max);

	return (
		<AccordionItem key={column.id} value={column.id}>
			<AccordionTrigger className="w-full px-4 py-2 text-left">
				<div className="flex flex-row gap-2 items-center">
					<span className="text-accent-foreground">
						{column.columnDef.header as string}
					</span>
					{activeFilterString ? (
						<Badge className="text-[10px]">{activeFilterString}</Badge>
					) : null}
				</div>
			</AccordionTrigger>
			<AccordionContent className="px-4 py-2 pb-2 pt-4">
				<Slider
					defaultValue={[min, max]}
					value={(columnFilterValue as [number, number]) ?? [min, max]}
					min={min}
					max={max}
					step={1}
					className="mx-auto w-full max-w-xs"
					onValueChange={([min, max]) => {
						console.log([min, max]);
						column.setFilterValue([min, max]);
					}}
				/>
				<div className="flex flex-row gap-2 mt-4">
					<Input
						type="number"
						min={min}
						max={max}
						value={(columnFilterValue as [number, number])?.[0] ?? ""}
						placeholder={`Min (${min})`}
						onChange={(e) => {
							const newMin = Number(e.target.value);
							const currentMax =
								(columnFilterValue as [number, number])?.[1] ?? max;
							column.setFilterValue([newMin, currentMax]);
						}}
					/>
					<Input
						type="number"
						min={min}
						max={max}
						value={(columnFilterValue as [number, number])?.[1] ?? ""}
						placeholder={`Max (${max})`}
						onChange={(e) => {
							const newMax = Number(e.target.value);
							const currentMin =
								(columnFilterValue as [number, number])?.[0] ?? min;
							column.setFilterValue([currentMin, newMax]);
						}}
					/>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}

/**
 * Get the unique values for a column, sorted alphabetically.
 * @param column The column to get the unique values for.
 * @returns An array of unique values for the column.
 */
function getUniqueKeys(
	column: Column<TableBodyRowType, unknown>,
): { name: string; amount: number }[] {
	const rawKeys = column.getFacetedUniqueValues().keys() ?? [];
	const allKeys = Array.from(rawKeys).flatMap((value) =>
		Array.isArray(value) ? value : [value],
	);

	const keys = new Map<string, number>();
	allKeys.forEach((key) => {
		const stringKey = String(key);
		keys.set(stringKey, (keys.get(stringKey) ?? 0) + 1);
	});

	return Array.from(keys.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, amount]) => ({ name, amount }));
}

/**
 * Convert the active filter value to a string representation for display in the badge.
 * @param activeFilter The active filter value.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A string representation of the active filter.
 */
function activeFilterToString(
	activeFilter: unknown,
	min: number,
	max: number,
): string {
	const filter = Array.isArray(activeFilter) ? activeFilter : [];
	let activeBadgeValueString = "";
	if (min < filter[0] && max > filter[1]) {
		activeBadgeValueString = `${filter[0]} - ${filter[1]}`;
	} else if (min < filter[0]) {
		activeBadgeValueString = `>${filter[0]}`;
	} else if (max > filter[1]) {
		activeBadgeValueString = `<${filter[1]}`;
	}
	return activeBadgeValueString;
}
