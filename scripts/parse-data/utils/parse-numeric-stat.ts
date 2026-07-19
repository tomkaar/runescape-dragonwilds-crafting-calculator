/**
 * Parses a raw wiki stat string into a number.
 * Handles plain numbers ("50") as well as qualitative-labeled values
 * ("Moderate (30)"), extracting the parenthetical number in the latter case.
 * Returns undefined for missing/empty/unparseable values.
 */
export function parseNumericStat(
	value: string | undefined,
): number | undefined {
	if (!value) return undefined;

	const parenMatch = value.match(/\(([\d.]+)\)/);
	const numeric = Number(parenMatch ? parenMatch[1] : value);

	return Number.isNaN(numeric) ? undefined : numeric;
}
