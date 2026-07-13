import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { TableBodyRowType } from "../types/table-body-row";

type Props = {
	table: Table<TableBodyRowType>;
};

export default function TableHead({ table }: Props) {
	return (
		<thead className="grid sticky top-0 z-10 bg-card">
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id} className="flex w-full border-b border-border">
					{headerGroup.headers.map((header) => (
						<th
							key={header.id}
							className="flex px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none whitespace-nowrap"
							style={{ width: header.getSize() }}
						>
							<div
								{...{
									className: header.column.getCanSort()
										? "cursor-pointer select-none"
										: "",
									onClick: header.column.getToggleSortingHandler(),
								}}
							>
								{flexRender(
									header.column.columnDef.header,
									header.getContext(),
								)}
								{{
									asc: <ArrowUp className="inline ml-1" size={12} />,
									desc: <ArrowDown className="inline ml-1" size={12} />,
								}[header.column.getIsSorted() as string] ?? (
									<ArrowUpDown className="inline ml-1" size={12} />
								)}
							</div>
						</th>
					))}
				</tr>
			))}
		</thead>
	);
}
