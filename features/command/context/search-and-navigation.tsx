"use client";

import {
	createContext,
	type Dispatch,
	type ReactElement,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from "react";

type SearchAndNavigationContext = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<SearchAndNavigationContext | null>(null);

/**
 * Hook to access the search and navigation (command menu) context.
 * @returns The search and navigation context.
 * @throws Will throw an error if used outside of a SearchAndNavigationProvider.
 */
export const useSearchAndNavigation = () => {
	const c = useContext(Context);
	if (!c) {
		throw new Error(
			"useSearchAndNavigation must be used within a SearchAndNavigationProvider",
		);
	}
	return c;
};

type Props = {
	children: ReactNode;
};

/**
 * Provides the open state of the search and navigation command menu,
 * so it can be opened from anywhere in the app.
 */
export function SearchAndNavigationProvider({ children }: Props): ReactElement {
	const [open, setOpen] = useState(false);

	return (
		<Context.Provider value={{ open, setOpen }}>{children}</Context.Provider>
	);
}
