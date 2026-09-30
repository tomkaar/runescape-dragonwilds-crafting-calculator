"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import facilitiesJSON from "@/data/facilities.json";
import { ALWAYS_AVAILABLE_FACILITIES } from "@/features/crafting-progress/utils/facility-checklist";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";

const listedFacilities = facilitiesJSON.filter(
	(facility) => !ALWAYS_AVAILABLE_FACILITIES.includes(facility.name),
);
const listedFacilityNames = listedFacilities.map((facility) => facility.name);

type EditorProps = {
	owned: Record<string, boolean>;
	setOwned: (facility: string, owned: boolean) => void;
	setAllOwned: (facilities: string[], owned: boolean) => void;
};

/**
 * Facility checkboxes. Edits go to the settings dialog's draft, so there's no
 * confirm on Unselect all - Cancel is the undo.
 */
export function FacilitiesEditor({
	owned,
	setOwned,
	setAllOwned,
}: EditorProps) {
	const ownedCount = listedFacilityNames.filter((name) => owned[name]).length;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={ownedCount === listedFacilityNames.length}
					onClick={() => setAllOwned(listedFacilityNames, true)}
				>
					Select all
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={ownedCount === 0}
					onClick={() => setAllOwned(listedFacilityNames, false)}
				>
					Unselect all
				</Button>
				<span className="ml-auto text-xs text-muted-foreground">
					{ownedCount} / {listedFacilityNames.length} owned
				</span>
			</div>

			<div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-x-6">
				{listedFacilities.map((facility) => (
					<div key={facility.id} className="flex items-center gap-2 text-sm">
						<Checkbox
							id={`facility-${facility.id}`}
							checked={!!owned[facility.name]}
							onCheckedChange={(checked) => setOwned(facility.name, !!checked)}
						/>
						<label
							htmlFor={`facility-${facility.id}`}
							className="flex items-center gap-2 cursor-pointer"
						>
							{getFacilityIcon(facility.name as (typeof Facility)[number], 20)}
							{facility.name}
						</label>
					</div>
				))}
			</div>
		</div>
	);
}
