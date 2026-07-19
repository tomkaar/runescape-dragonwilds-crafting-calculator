import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { getSkillImageUrl } from "@/utils/getSkillImageUrl";
import { ColumnId } from "../types/column-id";
import type { TableBodyRowType } from "../types/table-body-row";
import { tableData } from "./data";

const columnHelper = createColumnHelper<TableBodyRowType>();

/**
 * The [min, max] the FilterRange slider renders for a column (mirrors its
 * `Math.min/max(..., 0)` floor). A filter spanning this whole range is
 * indistinguishable from an untouched slider, so it's treated as "no
 * filter" - otherwise it would incorrectly hide every row that has no
 * value for this stat at all.
 */
function fullRangeOf(values: (number | undefined)[]): [number, number] {
	const defined = values.filter((v): v is number => v !== undefined);
	return [Math.min(...defined, 0), Math.max(...defined, 0)];
}

const HYDRATION_RANGE = fullRangeOf(tableData.map((row) => row.hydration));
const SUSTENANCE_RANGE = fullRangeOf(tableData.map((row) => row.sustenance));

export const columns = [
	columnHelper.accessor(ColumnId.Name, {
		header: "Item name",
		size: 250,
		cell: (info) => {
			const image = info.row.original.image;
			return (
				<Link
					prefetch={false}
					href={`/item/${info.row.original.itemId}`}
					className="flex items-center gap-2  py-1 px-4"
				>
					{image && (
						<img
							src={createImageUrlPath(image)}
							alt={info.getValue()}
							width={28}
							height={28}
							className="shrink-0 h-7 w-7"
						/>
					)}
					<span>{info.getValue()}</span>
				</Link>
			);
		},
		filterFn: "fuzzy",
	}),
	columnHelper.accessor(ColumnId.Variant, {
		header: "Variant",
		size: 120,
		cell: (info) => (
			<div className="flex items-center py-1 px-4">
				{info.getValue() ?? "—"}
			</div>
		),
	}),
	columnHelper.accessor(ColumnId.ItemType, {
		header: "Type",
		size: 140,
		meta: {
			filterVariant: "itemType",
			description: "The kind of item, like tools, weapons, or food.",
		},
		cell: (info) => (
			<div className="flex items-center py-1 px-4">
				{info.getValue() ?? "—"}
			</div>
		),
		filterFn: (row, _columnId, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			const itemType = row.original.itemType;
			return itemType ? filterValue.includes(itemType) : false;
		},
	}),
	columnHelper.accessor(ColumnId.Facilities, {
		header: "Facilities",
		size: 180,
		meta: {
			filterVariant: "facilities",
			description: "The crafting facility required to make the item.",
		},
		cell: (info) => {
			const facilities = info.getValue();
			if (facilities.length === 0) return <div className="py-1 px-4">—</div>;
			return (
				<div className="flex flex-row flex-wrap items-center gap-0.5 py-1 px-4">
					{facilities.map((facility) => (
						<button
							key={facility}
							type="button"
							className="p-0"
							onClick={() =>
								info.column.setFilterValue(toggleFilterValue(facility))
							}
						>
							<Badge key={facility} variant="outline" className="text-xs">
								{getFacilityIcon(facility as (typeof Facility)[number], 20)}{" "}
								{facility}
							</Badge>
						</button>
					))}
				</div>
			);
		},
		filterFn: (row, _columnId, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			const facilities = row.original.facilities;
			return facilities.some((f) => filterValue.includes(f));
		},
	}),
	columnHelper.accessor(ColumnId.Skills, {
		header: "Skills",
		size: 150,
		meta: {
			filterVariant: "skills",
			description: "The skill used to craft the item.",
		},
		cell: (info) => {
			const skills = info.getValue();
			if (skills.length === 0) return <div className="py-1 px-4">—</div>;
			return (
				<div className="w-full flex items-center py-1 px-4">
					<div className="flex flex-wrap gap-1">
						{skills.map((skill) => (
							<button
								key={skill}
								type="button"
								className="p-0"
								onClick={() =>
									info.column.setFilterValue(toggleFilterValue(skill))
								}
							>
								<Badge key={skill} variant="secondary" className="text-xs">
									<img
										src={getSkillImageUrl(skill)}
										alt={skill}
										width={20}
										height={20}
										className="shrink-0"
									/>{" "}
									{skill}
								</Badge>
							</button>
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
	columnHelper.accessor(ColumnId.Health, {
		header: "Health",
		size: 100,
		meta: {
			filterVariant: "range",
			description: "The amount of health the item restores when consumed.",
		},
		cell: (info) => (
			<div className="flex items-center py-1 px-4">{info.getValue() || ""}</div>
		),
		filterFn: (
			row,
			_columnId,
			filterValue: [number | undefined, number | undefined],
		) => {
			if (!filterValue) return true;
			const val = row.original.health;
			if (val === undefined) return false;
			const [min, max] = filterValue;
			if (min !== undefined && val < min) return false;
			if (max !== undefined && val > max) return false;
			return true;
		},
	}),
	columnHelper.accessor(ColumnId.Hydration, {
		header: "Hydration",
		size: 120,
		meta: {
			filterVariant: "range",
			description: "The amount of hydration the item restores when consumed.",
		},
		cell: (info) => (
			<div className="flex items-center py-1 px-4">{info.getValue() ?? ""}</div>
		),
		filterFn: (
			row,
			_columnId,
			filterValue: [number | undefined, number | undefined],
		) => {
			if (!filterValue) return true;
			const [min, max] = filterValue;
			if (
				(min ?? HYDRATION_RANGE[0]) <= HYDRATION_RANGE[0] &&
				(max ?? HYDRATION_RANGE[1]) >= HYDRATION_RANGE[1]
			) {
				return true;
			}
			const val = row.original.hydration;
			if (val === undefined) return false;
			if (min !== undefined && val < min) return false;
			if (max !== undefined && val > max) return false;
			return true;
		},
	}),
	columnHelper.accessor(ColumnId.Sustenance, {
		header: "Sustenance",
		size: 140,
		meta: {
			filterVariant: "range",
			description: "The amount of sustenance the item restores when consumed.",
		},
		cell: (info) => (
			<div className="flex items-center py-1 px-4">{info.getValue() ?? ""}</div>
		),
		filterFn: (
			row,
			_columnId,
			filterValue: [number | undefined, number | undefined],
		) => {
			if (!filterValue) return true;
			const [min, max] = filterValue;
			if (
				(min ?? SUSTENANCE_RANGE[0]) <= SUSTENANCE_RANGE[0] &&
				(max ?? SUSTENANCE_RANGE[1]) >= SUSTENANCE_RANGE[1]
			) {
				return true;
			}
			const val = row.original.sustenance;
			if (val === undefined) return false;
			if (min !== undefined && val < min) return false;
			if (max !== undefined && val > max) return false;
			return true;
		},
	}),
	columnHelper.accessor(ColumnId.OutputQuantity, {
		header: "Output",
		size: 100,
		meta: {
			filterVariant: "range",
			description: "The number of items a single craft produces.",
		},
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
	columnHelper.accessor(ColumnId.Materials, {
		header: "Materials",
		size: 480,
		meta: {
			filterVariant: "materials",
			description: "The materials required to craft the item.",
		},
		filterFn: (row, _columnId, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			return row.original.materials.some((m) => filterValue.includes(m.name));
		},
		cell: (info) => {
			const materials = info.row.original.materials;
			if (materials.length === 0) return <div className="py-1 px-4">—</div>;
			return (
				<div className="flex flex-row flex-wrap items-center gap-0.5 py-1 px-4">
					{materials.map((mat) => (
						<button
							key={mat.itemId}
							type="button"
							className="p-0"
							onClick={() =>
								info.column.setFilterValue(toggleFilterValue(mat.name))
							}
						>
							<Badge key={mat.itemId} variant="outline" className="text-sm">
								{mat.image && (
									<img
										src={createImageUrlPath(mat.image)}
										alt={mat.name}
										width={18}
										height={18}
										className="shrink-0"
									/>
								)}
								{mat.quantity}x {mat.name}
							</Badge>
						</button>
					))}
				</div>
			);
		},
	}),
];

/**
 * Toggles a filter value in the column filter state. If the value is already present, it removes it; otherwise, it adds it.
 * @param value The filter value to toggle.
 * @returns A function that takes the old filter values and returns the new filter values.
 */
function toggleFilterValue(value: string) {
	return (old: string[] | undefined) => {
		if (old?.includes(value)) {
			return old.filter((s) => s !== value);
		}
		return [...(old ?? []), value];
	};
}
