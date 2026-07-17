import type { ColumnFiltersState, Table } from "@tanstack/react-table";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { TableBodyRowType } from "../types/table-body-row";
import FilterRange from "./filter-range";
import FilterSelectMultiple from "./filter-select-multiple";

type Props = {
	table: Table<TableBodyRowType>;
	columnFilters: ColumnFiltersState;
	globalFilter: string;
	setGlobalFilter: (value: string) => void;
};

export default function Filter({
	table,
	columnFilters,
	globalFilter,
	setGlobalFilter,
}: Props) {
	const [sheetOpen, setSheetOpen] = useState(false);

	const numberOfItems = table.getFilteredRowModel().rows.length;
	const defaultValue = columnFilters.map((filter) => filter.id);

	function resetFilters() {
		table.resetColumnFilters();
		table.resetGlobalFilter();
	}

	return (
		<div className="flex flex-col gap-4 min-w-68 pb-8 text-muted-foreground overflow-scroll h-full">
			<div className="flex flex-row gap-2 w-full items-center justify-between px-4 py-2">
				<div className="flex flex-col gap-0 justify-center">
					<h2 className="text-accent-foreground font-semibold text-lg leading-5">
						Filter
					</h2>
					<span className="text-muted-foreground text-xs leading-4">
						{numberOfItems} item{numberOfItems !== 1 ? "s" : ""}
					</span>
				</div>

				<div className="flex flex-row gap-2">
					<Button variant="outline" onClick={resetFilters}>
						Reset
					</Button>
					<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
						<SheetTrigger
							render={
								<Button variant="outline" size="icon" className="lg:hidden">
									<MenuIcon className="h-4 w-4" />
								</Button>
							}
						/>
						<SheetContent side="right" className="w-64">
							<SheetHeader>
								<SheetTitle>Filter</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-1">
								<Accordion
									type="multiple"
									className="w-full"
									defaultValue={defaultValue}
								>
									<Columns table={table} />
								</Accordion>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div className="hidden lg:block px-4 py-2">
				<Field>
					<FieldLabel
						htmlFor="input-item-name"
						className="text-accent-foreground"
					>
						Item name
					</FieldLabel>
					<Input
						id="input-item-name"
						type="text"
						placeholder="Item name"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
				</Field>
			</div>

			<div className="hidden lg:block">
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={defaultValue}
				>
					<Columns table={table} />
				</Accordion>
			</div>
		</div>
	);
}

function Columns({ table }: { table: Table<TableBodyRowType> }) {
	const leafColumns = table.getAllLeafColumns();
	return (
		<>
			{leafColumns.map((column) => {
				const { filterVariant } = column.columnDef.meta ?? {};

				switch (filterVariant) {
					case "facilities":
						return (
							<FilterSelectMultiple
								key={column.id}
								column={column}
								table={table}
								icon="facility"
								showMoreButton
							/>
						);
					case "skills":
						return (
							<FilterSelectMultiple
								key={column.id}
								column={column}
								table={table}
							/>
						);
					case "materials":
						return (
							<FilterSelectMultiple
								key={column.id}
								column={column}
								table={table}
								icon="material"
								showMoreButton
							/>
						);
					case "range":
						return (
							<FilterRange key={column.id} column={column} table={table} />
						);
					default:
						return null;
				}
			})}
		</>
	);
}
