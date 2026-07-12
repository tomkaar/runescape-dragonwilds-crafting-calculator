import { Scale } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function AffirmationDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					className="border border-border rounded-full p-1.5 size-9 flex items-center justify-center"
					type="button"
				>
					<Scale className="w-4 h-4" />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Affirmation</DialogTitle>
					<DialogDescription>
						<span className="text-xs text-foreground">
							<span className="block mt-2">
								Data from the RuneScape: Dragonwilds Wiki
							</span>

							<span className="block mt-2">
								Content licensed under CC BY-NC-SA 3.0
							</span>

							<span className="block mt-2">
								Not affiliated with Jagex Ltd., RuneScape: Dragonwilds Wiki or
								Weird Gloop
							</span>

							<span className="block mt-2">
								Data on this page are based on wiki data and content on this
								page may not always be accurate or up-to-date. Please verify
								with official sources.
							</span>
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
