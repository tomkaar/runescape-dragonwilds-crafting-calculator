import { Share2Icon } from "lucide-react";
import Link from "next/link";
import { GitHubMark } from "@/components/github-mark";
import { ShareDialog } from "@/features/sharing/components/share-dialog";
import { AffirmationDialog } from "./affirmation-dialog";
import { LastSynced } from "./last-synced";

export function DesktopNavUtilities() {
	return (
		<div className="shrink-0 hidden lg:flex gap-2 flex-row items-center">
			<div className="hidden lg:block">
				<LastSynced />
			</div>
			<ShareDialog>
				<button
					className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center"
					type="button"
					aria-label="Share"
				>
					<Share2Icon className="w-4 h-4" />
				</button>
			</ShareDialog>
			<AffirmationDialog />
			<Link
				prefetch={false}
				href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
				className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center"
			>
				<GitHubMark size={20} />
			</Link>
		</div>
	);
}
