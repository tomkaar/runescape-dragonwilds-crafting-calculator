export function idFromName(name: string): string {
	return slugify(name);
}

export function slugify(text: string): string {
	return text
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-") // Spaces -> -
		.replace(/-+/g, "-"); // Collapse multiple -
}
