import { FacilityNameOverride } from "./types";

/**
 * Add manual facility name overrides here when the source data
 * uses a different name than the one expected by the app.
 */
export const facilityNameOverrides: FacilityNameOverride[] = [
  { from: "Fletching Table", to: "Fletching Bench" },
  { from: "Anvil", to: "Smithing Anvil" },
];
