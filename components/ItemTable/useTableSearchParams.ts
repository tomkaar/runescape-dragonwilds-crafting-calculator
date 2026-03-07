import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";

function parseSearchParams(searchParams: URLSearchParams) {
  const sorting: SortingState = [];
  const sort = searchParams.get("sort");
  if (sort) {
    const dotIndex = sort.lastIndexOf(".");
    if (dotIndex > 0) {
      const id = sort.substring(0, dotIndex);
      const dir = sort.substring(dotIndex + 1);
      sorting.push({ id, desc: dir === "desc" });
    }
  }

  const globalFilter = searchParams.get("q") ?? "";

  const columnFilters: ColumnFiltersState = [];
  const facility = searchParams.get("facility");
  if (facility)
    columnFilters.push({ id: "facility", value: facility.split(",") });
  const skills = searchParams.get("skills");
  if (skills) columnFilters.push({ id: "skills", value: skills.split(",") });
  const materials = searchParams.get("materials");
  if (materials)
    columnFilters.push({ id: "materialCount", value: materials.split(",") });

  return { sorting, globalFilter, columnFilters };
}

function buildSearchParams(
  sorting: SortingState,
  globalFilter: string,
  columnFilters: ColumnFiltersState,
): string {
  const params = new URLSearchParams();

  if (sorting.length > 0) {
    params.set("sort", `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`);
  }
  if (globalFilter) {
    params.set("q", globalFilter);
  }

  for (const filter of columnFilters) {
    const values = filter.value as string[];
    if (!Array.isArray(values) || values.length === 0) continue;
    if (filter.id === "facility") params.set("facility", values.join(","));
    else if (filter.id === "skills") params.set("skills", values.join(","));
    else if (filter.id === "materialCount")
      params.set("materials", values.join(","));
  }

  const str = params.toString();
  return str ? `?${str}` : window.location.pathname;
}

export function useTableSearchParams() {
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>(
    () => parseSearchParams(searchParams).sorting,
  );
  const [globalFilter, setGlobalFilter] = useState(
    () => parseSearchParams(searchParams).globalFilter,
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    () => parseSearchParams(searchParams).columnFilters,
  );

  useEffect(() => {
    const url = buildSearchParams(sorting, globalFilter, columnFilters);
    window.history.replaceState(null, "", url);
  }, [sorting, globalFilter, columnFilters]);

  return {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
  };
}
