import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Instruction() {
	const router = useRouter();

	return (
		<div className="bg-dark-background h-full overflow-y-auto p-4">
			<div className="mx-auto flex max-w-4xl flex-col gap-4">
				<div className="bg-background rounded-lg border border-accent p-4">
					<h2 className="font-semibold text-sm">Progress tracker</h2>
					<p className="text-xs text-muted-foreground mt-0.5 max-w-md">
						Track crafting progress across every item you&apos;re working
						towards. Search for an item below to add it and get started.
					</p>
					<div className="mt-4 flex flex-row flex-wrap gap-2">
						<div className="flex-1 min-w-48">
							<Button
								onClick={() => router.push("/item")}
								variant="outline"
								className="w-full"
							>
								<span className="text-muted-foreground">⌘K</span> Search and
								navigate
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="bg-background rounded-lg border border-accent p-4">
						<span className="font-semibold text-sm">1. Items</span>
						<p className="text-xs text-muted-foreground mt-0.5">
							Once added, an item shows up here as a card. Open it, mark the
							materials that you need to collect and set a multiplier if you
							need more than one.
						</p>
					</div>
					<div className="bg-background rounded-lg border border-accent p-4">
						<span className="font-semibold text-sm">
							2. Collected Materials
						</span>
						<p className="text-xs text-muted-foreground mt-0.5">
							Enter how many of each material you already own. Materials are
							automatically marked Done once you have enough to craft the item.
						</p>
					</div>
					<div className="bg-background rounded-lg border border-accent p-4">
						<span className="font-semibold text-sm">3. Next Steps</span>
						<p className="text-xs text-muted-foreground mt-0.5">
							See what&apos;s left to gather in crafting order, from raw
							ingredients up to finished pieces, across all tracked items.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
