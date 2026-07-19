/**
 * Builds a wiki thumbnail URL for a skill icon from its name, e.g. "Artisan" ->
 * https://dragonwilds.runescape.wiki/images/thumb/Artisan.png/32px-Artisan.png
 * Mirrors the same thumb URL convention used for facility icons (getFacilityIcon).
 */
export function getSkillImageUrl(skill: string, size: number = 32): string {
	const encodedFilename = skill
		.replace(/ /g, "_")
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29");
	return `https://dragonwilds.runescape.wiki/images/thumb/${encodedFilename}.png/${size}px-${encodedFilename}.png`;
}
