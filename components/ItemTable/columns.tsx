import { createColumnHelper } from "@tanstack/react-table";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { Badge } from "@/components/ui/badge";
import { Facility } from "@/Types";

export type ItemTableRow = {
  itemId: string;
  itemName: string;

  variantId: string;
  variantName: string | null;

  image: string | null;

  facility: string | null;
  skills: string[];

  outputQuantity: number;

  materialCount: number;
  materials: {
    itemId: string;
    itemName: string;
    itemImage: string | null;
    quantity: number;
  }[];

  wikiLink?: string;
};

const columnHelper = createColumnHelper<ItemTableRow>();

export const columns = [
  columnHelper.accessor("itemName", {
    header: "Item",
    size: 250,
    cell: (info) => {
      const image = info.row.original.image;
      return (
        <div className="flex items-center gap-2  py-1 px-4">
          {image && (
            <img
              src={createImageUrlPath(image)}
              alt={info.getValue()}
              width={28}
              height={28}
              className="shrink-0"
            />
          )}
          <span>{info.getValue()}</span>
        </div>
      );
    },
    filterFn: "fuzzy",
    sortingFn: "fuzzySort",
  }),
  columnHelper.accessor("variantName", {
    header: "Variant",
    size: 120,
    cell: (info) => (
      <div className="flex items-center py-1 px-4">
        {info.getValue() ?? "—"}
      </div>
    ),
  }),
  columnHelper.accessor("facility", {
    header: "Facility",
    size: 180,
    cell: (info) => {
      const facility = info.getValue();
      if (!facility) return <div className="py-1 px-4">—</div>;
      return (
        <div className="flex items-center gap-1.5  py-1 px-4">
          {getFacilityIcon(facility as (typeof Facility)[number], 20)}
          <span>{facility}</span>
        </div>
      );
    },
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (filterValue.length === 0) return true;
      const facility = row.original.facility;
      return facility !== null && filterValue.includes(facility);
    },
  }),
  columnHelper.accessor("skills", {
    header: "Skills",
    size: 150,
    cell: (info) => {
      const skills = info.getValue();
      if (skills.length === 0) return <div className="py-1 px-4">—</div>;
      return (
        <div className="w-full flex items-center py-1 px-4">
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.skills[0] ?? "";
      const b = rowB.original.skills[0] ?? "";
      return a.localeCompare(b);
    },
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (filterValue.length === 0) return true;
      return row.original.skills.some((s) => filterValue.includes(s));
    },
  }),
  columnHelper.accessor("outputQuantity", {
    header: "Output",
    size: 100,
    cell: (info) => (
      <div className="flex items-center py-1 px-4">{info.getValue()}</div>
    ),
    filterFn: (
      row,
      _columnId,
      filterValue: [number | undefined, number | undefined],
    ) => {
      const val = row.original.outputQuantity;
      const [min, max] = filterValue;
      if (min !== undefined && val < min) return false;
      if (max !== undefined && val > max) return false;
      return true;
    },
  }),
  columnHelper.accessor("materialCount", {
    header: "Materials",
    size: 300,
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (filterValue.length === 0) return true;
      return row.original.materials.some((m) =>
        filterValue.includes(m.itemName),
      );
    },
    cell: (info) => {
      const materials = info.row.original.materials;
      if (materials.length === 0) return <div className="py-1 px-4">—</div>;
      return (
        <div className="flex flex-row flex-wrap items-center gap-0.5 py-1 px-4">
          {materials.map((mat) => (
            <Badge key={mat.itemId} variant="outline" className="text-sm">
              {mat.itemImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={createImageUrlPath(mat.itemImage)}
                  alt={mat.itemName}
                  width={18}
                  height={18}
                  className="shrink-0"
                />
              )}
              {mat.quantity}x {mat.itemName}
            </Badge>
          ))}
        </div>
      );
    },
  }),
];
