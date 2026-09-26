type SelectableMaterial = { nodeId: string };

/**
 * Compares a node's direct materials against the currently tracked entries.
 * `allSelected` is false when there are no materials, so callers never offer
 * to deselect an empty set.
 */
export function getMaterialSelection<T extends SelectableMaterial>(
	materials: T[],
	selected: Array<{ nodeId?: string }>,
): { allSelected: boolean; missing: T[] } {
	const selectedNodeIds = new Set(selected.map((item) => item.nodeId));
	const missing = materials.filter(
		(material) => !selectedNodeIds.has(material.nodeId),
	);

	return { allSelected: materials.length > 0 && missing.length === 0, missing };
}
