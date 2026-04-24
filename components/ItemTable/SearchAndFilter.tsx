import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Facility, Skill } from "@/Types";
import { MultiSelectFilter } from "./filters/MultiSelectFilter";
import { ItemTableRow } from "./columns";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";

const facilityOptions = Facility.map((f) => ({
  label: f,
  value: f,
  icon: getFacilityIcon(f, 18),
}));
const skillOptions = Skill.map((s) => ({ label: s, value: s }));

type Props = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  rowsCount: number;
  table: Table<ItemTableRow>;
};

export default function SearchAndFilter(props: Props) {
  const { globalFilter, setGlobalFilter, rowsCount, table } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const facilityColumn = table.getColumn("facility");
  const skillsColumn = table.getColumn("skills");
  const materialsColumn = table.getColumn("materialCount");

  const selectedFacilities =
    (facilityColumn?.getFilterValue() as string[]) ?? [];
  const selectedSkills = (skillsColumn?.getFilterValue() as string[]) ?? [];
  const selectedMaterials =
    (materialsColumn?.getFilterValue() as string[]) ?? [];

  const activeFilterCount =
    (selectedFacilities.length > 0 ? 1 : 0) +
    (selectedSkills.length > 0 ? 1 : 0) +
    (selectedMaterials.length > 0 ? 1 : 0);

  // Derive material options from the pre-filtered rows (rows before the materials column filter is applied)
  const materialOptions = useMemo(() => {
    const preFilteredRows = table.getPreFilteredRowModel().rows;
    const materialsMap = new Map<string, string | null>();
    for (const row of preFilteredRows) {
      for (const mat of row.original.materials) {
        if (!materialsMap.has(mat.itemName)) {
          materialsMap.set(mat.itemName, mat.itemImage);
        }
      }
    }
    return Array.from(materialsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, image]) => ({
        label: name,
        value: name,
        icon: image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={createImageUrlPath(image)} alt="" width={18} height={18} />
        ) : undefined,
      }));
  }, [table]);

  const filterControls = (
    <>
      <div className="flex flex-col gap-1 min-w-44">
        {/* <span className="text-xs text-neutral-400">Facility</span> */}
        <MultiSelectFilter
          options={facilityOptions}
          selected={selectedFacilities}
          onChange={(v) =>
            facilityColumn?.setFilterValue(v.length ? v : undefined)
          }
          placeholder="Facilities"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-40">
        {/* <span className="text-xs text-neutral-400">Skills</span> */}
        <MultiSelectFilter
          options={skillOptions}
          selected={selectedSkills}
          onChange={(v) =>
            skillsColumn?.setFilterValue(v.length ? v : undefined)
          }
          placeholder="Skills"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-44">
        {/* <span className="text-xs text-neutral-400">Materials</span> */}
        <MultiSelectFilter
          options={materialOptions}
          selected={selectedMaterials}
          onChange={(v) =>
            materialsColumn?.setFilterValue(v.length ? v : undefined)
          }
          placeholder="Materials"
        />
      </div>
    </>
  );

  return (
    <div className="p-4 border-b border-border flex flex-col gap-3">
      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex flex-col gap-1 grow lg:grow-0 min-w-44">
          <div className="w-full relative lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter items..."
              className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Mobile: drawer trigger */}
        <div className="lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger>
              <div className="relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9.5 rounded-md gap-1.5 px-3">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine the item list by selecting facilities, skills, or
                  materials. You can select multiple options in each category.
                  The item list will update automatically based on your
                  selections.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4 overflow-y-auto w-full">
                {filterControls}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: inline filters */}
        <div className="hidden lg:contents">{filterControls}</div>
      </div>

      <p className="text-xs text-muted-foreground">{rowsCount} results</p>
    </div>
  );
}
