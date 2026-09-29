"use client";

import { Share2Icon } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { useMobileShareDialog } from "../store/mobile-share-dialog";
import { ShareDialog } from "./share-dialog";

type Props = {
	className?: string;
};

/**
 * Menu entry, must be rendered inside the Sheet so it can close it.
 */
export function MobileShareMenuItem({ className }: Props) {
	const setOpen = useMobileShareDialog((state) => state.setOpen);

	return (
		<SheetClose
			render={
				<button type="button" className={className}>
					<Share2Icon size={16} />
					Share progress
				</button>
			}
			onClick={() => setOpen(true)}
		/>
	);
}

/**
 * Dialog instance, must be rendered outside the Sheet so it isn't unmounted with it.
 */
export function MobileShareDialog() {
	const open = useMobileShareDialog((state) => state.open);
	const setOpen = useMobileShareDialog((state) => state.setOpen);

	return <ShareDialog open={open} onOpenChange={setOpen} />;
}
