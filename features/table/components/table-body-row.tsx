import { flexRender, type Row } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import type { TableBodyRowType } from "../types/table-body-row";

type Props = {
	row: Row<TableBodyRowType>;
	virtualRow: VirtualItem;
	rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
};

export default function TableBodyRow({
	row,
	rowVirtualizer,
	virtualRow,
}: Props) {
	return (
		<tr
			data-index={virtualRow.index}
			ref={(node) => rowVirtualizer.measureElement(node)}
			className={cn(
				"flex absolute w-full border-b border-border hover:bg-card/50 transition-colors",
				virtualRow.index % 2 === 0 ? "bg-background" : "bg-card/50",
			)}
			style={{ transform: `translateY(${virtualRow.start}px)` }}
		>
			{row.getVisibleCells().map((cell) => (
				<td
					key={cell.id}
					className="flex"
					style={{ width: cell.column.getSize() }}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	);
}
