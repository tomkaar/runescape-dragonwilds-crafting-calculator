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
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import type { TableBodyRowType } from "../types/table-body-row";
import {
	fuzzyMatch,
	getUniqueKeys,
	selectedFirst,
} from "../utils/filter-helpers";

type Props = {
	showMoreButton?: boolean;
	/** Renders a facility icon or the material's item image next to each option. */
	icon?: "facility" | "material";
	table: Table<TableBodyRowType>;
	column: Column<TableBodyRowType, unknown>;
};

export default function FilterSelectMultiple({
	column,
	table,
	showMoreButton,
	icon,
}: Props) {
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
								.slice(0, showMoreButton && showAll ? undefined : 8)
								.map((value) => (
									<li key={value.name}>
										<FieldGroup className="border-b border-border ">
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
													{icon === "facility" ? (
														<div className="h-5 w-5 shrink-0 mr-1 overflow-hidden">
															{getFacilityIcon(
																value.name as (typeof Facility)[number],
																20,
															)}
														</div>
													) : icon === "material" ? (
														<div className="h-5 w-5 shrink-0 mr-1 overflow-hidden">
															{value.image ? (
																<img
																	src={createImageUrlPath(value.image)}
																	alt={value.name}
																	width={120}
																	height={120}
																	className="shrink-0"
																/>
															) : null}
														</div>
													) : null}
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

				{showMoreButton ? (
					<Button
						className="w-full mt-2"
						variant="ghost"
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? "Show Less" : "Show All"}
					</Button>
				) : null}
			</AccordionContent>
		</AccordionItem>
	);
}
