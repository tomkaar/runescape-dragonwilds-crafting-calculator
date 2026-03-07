import { Row, Table } from "@tanstack/react-table";
import { ItemTableRow } from "./columns";
import { useVirtualizer } from "@tanstack/react-virtual";
import TableBodyRow from "./TableBodyRow";
import { useEffect } from "react";

interface Props {
  table: Table<ItemTableRow>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableBody(props: Props) {
  const { table, tableContainerRef } = props;
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

  // Force measurement of all rows on mount to ensure that the body items are rendered directly
  // on first load, otherwise they won't render until the user triggers a re-render
  useEffect(() => {
    rowVirtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <tbody
      className="w-full"
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
        position: "relative", //needed for absolute positioning of rows
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<ItemTableRow>;
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
