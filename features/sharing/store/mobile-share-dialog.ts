"use client";

import { create } from "zustand";

/**
 * Open state for the share dialog opened from the mobile menu.
 * Lives outside the Sheet so the dialog survives the Sheet closing.
 */
export const useMobileShareDialog = create<{
	open: boolean;
	setOpen: (open: boolean) => void;
}>()((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
}));
