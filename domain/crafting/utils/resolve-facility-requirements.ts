import type { Facility, Item } from "@/Types";
import { resolveItemTree } from "./resolve-item-tree";
import { resolveUniqueFacilitiesFromItemTree } from "./resolve-unique-facilities-from-item-tree";

export type FacilityRequirements = {
	/** Facilities the item itself can be crafted at. */
	ownFacilities: string[];
	/** Facilities only required transitively by the item's ingredients, excluding anything already in ownFacilities. */
	additionalFacilities: string[];
};

/**
 * Splits the facilities involved in crafting an item into the facilities the item can be crafted at directly,
 * and any extra facilities only required by its ingredients further down the crafting tree.
 */
export function resolveFacilityRequirements(
	item: Item,
	itemId: string,
): FacilityRequirements {
	const ownFacilities = Array.from(
		new Set(
			item.facilities.filter(
				(facility): facility is (typeof Facility)[number] => facility !== null,
			),
		),
	);

	const itemTree = resolveItemTree(itemId);
	const treeFacilities = resolveUniqueFacilitiesFromItemTree(itemTree);
	const additionalFacilities = treeFacilities.filter(
		(facility) => !ownFacilities.includes(facility as never),
	);

	return { ownFacilities, additionalFacilities };
}
