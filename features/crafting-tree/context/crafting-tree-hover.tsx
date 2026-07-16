"use client";

import {
	createContext,
	type ReactElement,
	type ReactNode,
	useContext,
	useState,
} from "react";

type CraftingTreeHoverContext = {
	enter: (nodeId: string) => void;
	reset: () => void;
	check: (nodeId: string) => boolean;
	isSet: boolean;
};

const Context = createContext<CraftingTreeHoverContext>({
	enter: () => {},
	reset: () => {},
	check: () => false,
	isSet: false,
});

/**
 * Hook to access the crafting tree hover context.
 * @returns The crafting tree hover context.
 * @throws Will throw an error if used outside of a CraftingTreeHoverProvider.
 */
export const useCraftingTreeHover = () => {
	const c = useContext(Context);
	if (!c) {
		throw new Error(
			"useCraftingTreeHover must be used within a CraftingTreeHoverProvider",
		);
	}
	return c;
};

type Props = {
	children: ReactNode;
};

/**
 * Provides context for handling hover state within the crafting tree.
 */
export function CraftingTreeHoverProvider({ children }: Props): ReactElement {
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

	const enter = (nodeId: string) => {
		setHoveredNodeId(nodeId);
	};

	const reset = () => {
		setHoveredNodeId(null);
	};

	const check = (nodeId: string) => {
		if (!hoveredNodeId) return false;
		return nodeId.startsWith(hoveredNodeId);
	};

	return (
		<Context.Provider
			value={{ enter, reset, check, isSet: hoveredNodeId !== null }}
		>
			{children}
		</Context.Provider>
	);
}
