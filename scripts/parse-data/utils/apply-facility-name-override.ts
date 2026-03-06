import { facilityNameOverrides } from "../overrides/facility.name.overrides";

/**
 * Replaces a facility name if a matching override exists.
 * Returns the original name when no override applies.
 */
export function applyFacilityNameOverride(facility: string): string {
  const override = facilityNameOverrides.find((o) => o.from === facility);
  return override ? override.to : facility;
}
