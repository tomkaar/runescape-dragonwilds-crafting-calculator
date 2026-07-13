"use client";

import { type RefObject, useEffect, useState } from "react";

interface Dimensions {
	width: number;
	height: number;
}

export function useResize(
	ref: RefObject<HTMLElement | null>,
	deps: unknown[],
): Dimensions {
	const [width, setWidth] = useState<number>(0);
	const [height, setHeight] = useState<number>(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <known>
	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			// Using the scrollWidth and scrollHeight of the target ensures this works with CSS transitions
			// because it accounts for the height of the content before it's visually fully expanded, which elements[0].contentRect does not
			setWidth(entries[0].target.scrollWidth);
			setHeight(entries[0].target.scrollHeight);
		});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [deps, ref]);

	return { width, height };
}
