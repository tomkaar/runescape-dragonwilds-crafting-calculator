import { flexRender, Row } from "@tanstack/react-table";
import { ItemTableRow } from "./columns";
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";

interface Props {
  row: Row<ItemTableRow>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

export default function TableBodyRow(props: Props) {
  const { row, virtualRow, rowVirtualizer } = props;
  const router = useRouter();

  return (
    <tr
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      key={row.id}
      className={`flex absolute w-full border-b border-border hover:bg-card/50 cursor-pointer transition-colors ${virtualRow.index % 2 === 0 ? "bg-background" : "bg-card/50"}`}
      style={{ transform: `translateY(${virtualRow.start}px)` }}
      onClick={() => router.push(`/item/${row.original.itemId}`)}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            className="flex"
            style={{ flex: `${cell.column.getSize()} 0 0px` }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
