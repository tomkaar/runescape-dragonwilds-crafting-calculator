"use client";

import { SettingsIcon } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { useMobileSettingsDialog } from "../store/mobile-settings-dialog";
import { SettingsDialog } from "./settings-dialog";

type Props = {
	className?: string;
};

/**
 * Menu entry, must be rendered inside the Sheet so it can close it.
 */
export function MobileSettingsMenuItem({ className }: Props) {
	const setOpen = useMobileSettingsDialog((state) => state.setOpen);

	return (
		<SheetClose
			render={
				<button type="button" className={className}>
					<SettingsIcon size={16} />
					Settings
				</button>
			}
			onClick={() => setOpen(true)}
		/>
	);
}

/**
 * Dialog instance, must be rendered outside the Sheet so it isn't unmounted with it.
 */
export function MobileSettingsDialog() {
	const open = useMobileSettingsDialog((state) => state.open);
	const setOpen = useMobileSettingsDialog((state) => state.setOpen);

	return <SettingsDialog open={open} onOpenChange={setOpen} />;
}
