import Link from "next/link";
import { AffirmationDialog } from "./affirmation-dialog";
import { LastSynced } from "./last-synced";

export function DesktopNavUtilities() {
	return (
		<div className="shrink-0 hidden lg:flex gap-2 flex-row items-center">
			<div className="hidden lg:block">
				<LastSynced />
			</div>
			<AffirmationDialog />
			<Link
				href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
				className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center"
			>
				<img
					src="/github.svg"
					alt=""
					width={20}
					height={20}
					className="invert"
				/>
			</Link>
		</div>
	);
}
