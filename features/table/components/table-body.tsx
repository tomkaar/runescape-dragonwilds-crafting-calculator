import type { Row, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";
import type { TableBodyRowType } from "../types/table-body-row";
import TableBodyRow from "./table-body-row";

type Props = {
	table: Table<TableBodyRowType>;
	tableContainerRef: RefObject<HTMLDivElement | null>;
};

export default function TableBody({ table, tableContainerRef }: Props) {
	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});

	return (
		<tbody
			className="grid relative"
			style={{ height: rowVirtualizer.getTotalSize() }}
		>
			{rowVirtualizer.getVirtualItems().map((virtualRow) => {
				const row = rows[virtualRow.index] as Row<TableBodyRowType>;
				return (
					<TableBodyRow
						key={row.id}
						row={row}
						virtualRow={virtualRow}
						rowVirtualizer={rowVirtualizer}
					/>
				);
			})}
		</tbody>
	);
}
