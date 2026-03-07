"use client";

import { useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { columns } from "./columns";
import { tableData } from "./data";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import SearchAndFilter from "./SearchAndFilter";
import { fuzzyFilter, fuzzySort } from "./fuzzy";

export function ItemTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter: globalFilter || undefined, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
    sortingFns: { fuzzySort },
  });

  const { rows } = table.getRowModel();

  return (
    <div className="flex flex-col h-full">
      <SearchAndFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rowsCount={rows.length}
        table={table}
      />

      <div ref={tableContainerRef} className="w-full overflow-auto flex-1">
        <table className="grid w-full min-w-200">
          <TableHead table={table} />
          <TableBody table={table} tableContainerRef={tableContainerRef} />
        </table>
      </div>
    </div>
  );
}
