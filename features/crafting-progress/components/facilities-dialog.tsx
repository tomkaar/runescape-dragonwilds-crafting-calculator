"use client";

import { Wrench } from "lucide-react";
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
import { useFacilitiesOwned } from "@/store/facilities-owned";
import type { Facility } from "@/Types";
import getFacilityIcon from "@/utils/getFacilityIcon";
import { ALWAYS_AVAILABLE_FACILITIES } from "../utils/facility-checklist";

const listedFacilities = facilitiesJSON.filter(
	(facility) => !ALWAYS_AVAILABLE_FACILITIES.includes(facility.name),
);

export function FacilitiesDialog() {
	const owned = useFacilitiesOwned((state) => state.owned);
	const setOwned = useFacilitiesOwned((state) => state.setOwned);

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
