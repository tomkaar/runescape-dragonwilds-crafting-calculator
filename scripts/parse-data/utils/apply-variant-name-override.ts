import { variantNameOverrides } from "../overrides/variant-name.overrides";

/**
 * Replaces a variant name if a matching override exists.
 * Returns the original name when no override applies.
 */
export function applyVariantNameOverride(variant: string): string {
	const override = variantNameOverrides.find((o) => o.from === variant);
	return override ? override.to : variant;
}
