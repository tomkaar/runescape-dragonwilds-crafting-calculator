import { flexRender, Table } from "@tanstack/react-table";
import { ItemTableRow } from "./columns";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface TableHeadProps {
  table: Table<ItemTableRow>;
}

export default function TableHead(props: TableHeadProps) {
  const { table } = props;

  return (
    <thead className="grid sticky top-0 z-10 bg-card">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          style={{ display: "flex", width: "100%" }}
          className="w-full border-b border-border"
        >
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                className="flex px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none whitespace-nowrap"
                style={{ flex: `${header.getSize()} 0 0px` }}
              >
                <div
                  {...{
                    className: header.column.getCanSort() ? "select-none" : "",
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
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
