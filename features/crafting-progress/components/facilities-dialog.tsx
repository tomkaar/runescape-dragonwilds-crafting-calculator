"use client";

import { Wrench } from "lucide-react";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import facilitiesJSON from "@/data/facilities.json";
import { useFacilitiesOwned } from "@/store/settings";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { ALWAYS_AVAILABLE_FACILITIES } from "../utils/facility-checklist";

const listedFacilities = facilitiesJSON.filter(
	(facility) => !ALWAYS_AVAILABLE_FACILITIES.includes(facility.name),
);
const listedFacilityNames = listedFacilities.map((facility) => facility.name);

export function FacilitiesDialog() {
	const { owned, setOwned, setAllOwned } = useFacilitiesOwned();
	const ownedCount = listedFacilityNames.filter((name) => owned[name]).length;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5">
					<Wrench className="w-4 h-4" />
					My facilities
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>My facilities</DialogTitle>
					<DialogDescription>
						Check off facilities you've already unlocked or built. This applies
						across all your plans, not just the current one.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={ownedCount === listedFacilityNames.length}
						onClick={() => setAllOwned(listedFacilityNames, true)}
					>
						Select all
					</Button>
					<ConfirmAlertDialog
						trigger={
							<Button variant="outline" size="sm" disabled={ownedCount === 0}>
								Unselect all
							</Button>
						}
						title="Unselect all facilities?"
						description="This clears every checked facility. It applies across all your plans, not just the current one."
						confirmLabel="Unselect all"
						onConfirm={() => setAllOwned(listedFacilityNames, false)}
					/>
				</div>

				<div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
					{listedFacilities.map((facility) => (
						<div key={facility.id} className="flex items-center gap-2 text-sm">
							<Checkbox
								id={`facility-${facility.id}`}
								checked={!!owned[facility.name]}
								onCheckedChange={(checked) =>
									setOwned(facility.name, !!checked)
								}
							/>
							<label
								htmlFor={`facility-${facility.id}`}
								className="flex items-center gap-2 cursor-pointer"
							>
								{getFacilityIcon(
									facility.name as (typeof Facility)[number],
									20,
								)}
								{facility.name}
							</label>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
