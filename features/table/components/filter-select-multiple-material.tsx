import type { Column, Table } from "@tanstack/react-table";
import { useState } from "react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { TableBodyRowType } from "../types/table-body-row";

type Props = {
	table: Table<TableBodyRowType>;
	column: Column<TableBodyRowType, unknown>;
};

export default function FilterSelectMultipleMaterial({ column, table }: Props) {
	const [filterValue, setFilterValue] = useState<string>("");
	const [showAll, setShowAll] = useState<boolean>(false);

	const columnFilterValue = table.getColumn(column.id)?.getFilterValue();
	const uniqueKeys = getUniqueKeys(column);

	return (
		<AccordionItem key={column.id} value={column.id}>
			<AccordionTrigger className="w-full px-4 py-2 text-left">
				<div className="flex flex-row gap-2 items-center">
					<span className="text-accent-foreground">
						{column.columnDef.header as string}
					</span>
					{Array.isArray(columnFilterValue) && columnFilterValue.length ? (
						<Badge className="text-[10px]">{columnFilterValue.length}</Badge>
					) : null}
				</div>
			</AccordionTrigger>
			<AccordionContent className="px-4 py-2 pb-2">
				<Input
					placeholder={`Search ${column.columnDef.header}...`}
					value={filterValue}
					onChange={(e) => setFilterValue(e.target.value)}
				/>

				<div className="flex flex-col mt-2">
					{uniqueKeys?.length ? (
						<ul className="flex flex-col border border-border rounded-sm">
							{uniqueKeys
								.filter(fuzzyMatch(filterValue))
								.sort(selectedFirst(columnFilterValue))
								.slice(0, showAll ? undefined : 8)
								.map((value) => (
									<li key={value.name}>
										<FieldGroup className="border-b border-border">
											<Field orientation="horizontal">
												<FieldLabel className="p-2 cursor-pointer has-data-[state=checked]:border-none dark:has-data-[state=checked]:bg-primary/0">
													<Checkbox
														checked={
															Array.isArray(columnFilterValue) &&
															columnFilterValue.includes(value.name)
														}
														onCheckedChange={(checked) => {
															column.setFilterValue((old: string[]) => {
																if (checked) {
																	return [...(old ?? []), value.name];
																}
																if (old) {
																	return old.filter((v) => v !== value.name);
																}
																return old;
															});
														}}
													/>
													<div className="h-5 w-5 shrink-0 mr-1 overflow-hidden">
														<img
															src={createImageUrlPath(value.image)}
															alt={value.name}
															width={120}
															height={120}
															className="shrink-0"
														/>
													</div>
													<div className="grow">{value.name}</div>
													<div className="font-semibold">{value.amount}</div>
												</FieldLabel>
											</Field>
										</FieldGroup>
									</li>
								))}
						</ul>
					) : null}
				</div>

				<Button
					className="w-full mt-2"
					variant="ghost"
					onClick={() => setShowAll(!showAll)}
				>
					{showAll ? "Show Less" : "Show All"}
				</Button>
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
): { name: string; image: string; amount: number }[] {
	const rawKeys = column.getFacetedUniqueValues().keys() ?? [];
	const allKeys = Array.from(rawKeys).flatMap((value) =>
		Array.isArray(value) ? value : [value],
	);

	const keys = new Map<string, { image: string; amount: number }>();
	allKeys.forEach((key) => {
		const stringKey = String(key.name);
		keys.set(stringKey, {
			image: key.image,
			amount: (keys.get(stringKey)?.amount ?? 0) + 1,
		});
	});

	return Array.from(keys.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, { image, amount }]) => ({ name, image, amount }));
}

/**
 * Sort the values so that the selected values are first, and then sort the rest alphabetically.
 * @param selectedValues The values that are selected.
 * @returns A function that sorts the values.
 */
function selectedFirst(selectedValues: unknown) {
	if (!Array.isArray(selectedValues)) {
		return () => 0;
	}
	const selected = selectedValues as string[];

	return (a: { name: string }, b: { name: string }) => {
		const aSelected = selected.includes(a.name);
		const bSelected = selected.includes(b.name);

		if (aSelected && !bSelected) return -1;
		if (!aSelected && bSelected) return 1;

		return a.name.localeCompare(b.name);
	};
}

/**
 * Fuzzy match the value against the filter value.
 * @param filterValue The value to match against.
 * @returns A function that returns true if the value matches the filter value.
 */
function fuzzyMatch(filterValue: string) {
	return (value: { name: string }) => {
		if (typeof value.name !== "string") return false;
		if (!filterValue) return true;

		const lowerValue = value.name.toLowerCase();
		const lowerFilter = filterValue.toLowerCase();

		return lowerValue.includes(lowerFilter);
	};
}
