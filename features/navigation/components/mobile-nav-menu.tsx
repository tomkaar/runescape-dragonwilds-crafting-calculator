import { HomeIcon, ListIcon, MenuIcon, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { LastSynced } from "./last-synced";
import { ProgressNavLink } from "./progress-nav-link";

export function MobileNavMenu() {
	return (
		<div className="shrink-0 flex lg:hidden">
			<Sheet>
				<SheetTrigger
					render={
						<Button variant="ghost" size="icon-sm">
							<MenuIcon />
							<span className="sr-only">Open menu</span>
						</Button>
					}
				/>
				<SheetContent side="right" className="w-64">
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<nav className="flex flex-col gap-1 px-4">
						<Link
							href="/"
							className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
						>
							<HomeIcon size={16} />
							Home
						</Link>
						<Link
							href="/item"
							className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
						>
							<ListIcon size={16} />
							All items
						</Link>
						<ProgressNavLink className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card" />
						<a
							href="https://dragonwilds.runescape.wiki"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
						>
							<Scale size={16} />
							Official Wiki
						</a>
						<a
							href="https://github.com/tomkaar/runescape-dragonwilds-crafting-calculator"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-card"
						>
							<img
								src="/github.svg"
								alt=""
								width={16}
								height={16}
								className="invert"
							/>
							GitHub
						</a>
					</nav>
					<div className="px-6 mt-2 flex flex-col gap-3 text-start">
						<LastSynced />
						<p className="text-xs text-muted-foreground border-t border-border pt-3">
							Data from the RuneScape: Dragonwilds Wiki. Content licensed under
							CC BY-NC-SA 3.0. Not affiliated with Jagex Ltd., RuneScape:
							Dragonwilds Wiki or Weird Gloop. Data may not always be accurate
							or up-to-date.
						</p>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
