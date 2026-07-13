"use client";

import {
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRef } from "react";
import Filter from "@/features/table/components/filter";
import { columns } from "@/features/table/utils/columns";
import { tableData } from "@/features/table/utils/data";
import { fuzzyFilter, fuzzySort } from "@/features/table/utils/fuzzy";
import { useResize } from "@/hooks/useResize";
import useFilter from "../hooks/use-table-filter";
import TableBody from "./table-body";
import TableHead from "./table-head";

export default function Table() {
	const divContainerRef = useRef<HTMLDivElement>(null);
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const { height } = useResize(divContainerRef, []);

	const {
		columnFilters,
		globalFilter,
		sorting,
		setColumnFilters,
		setGlobalFilter,
		setSorting,
	} = useFilter();

	const table = useReactTable({
		data: tableData,
		columns,
		state: { sorting, globalFilter, columnFilters },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		filterFns: { fuzzy: fuzzyFilter },
		sortingFns: { fuzzySort },
	});

	return (
		<div
			className="flex flex-col lg:flex-row h-[calc(100vh-129px)] lg:h-[calc(100vh-69px)]"
			ref={divContainerRef}
		>
			<aside className="border-b lg:border-r border-border">
				<Filter
					table={table}
					columnFilters={columnFilters}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
			</aside>

			<main
				className="flex-1 overflow-auto relative"
				style={{ height }}
				ref={tableContainerRef}
			>
				<table className="text-muted-foreground grid">
					<TableHead table={table} />
					<TableBody table={table} tableContainerRef={tableContainerRef} />
				</table>
			</main>
		</div>
	);
}
