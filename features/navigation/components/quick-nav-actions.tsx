import { CheckCircleIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommandWithShortcuts } from "@/features/command/components/command-with-shortcuts";

export function QuickNavActions() {
	return (
		<div className="grow flex flex-row justify-center lg:justify-start items-center gap-4">
			<CommandWithShortcuts buttonClassName="grow lg:grow-0" />
			<Link href="/item" prefetch={false}>
				<Button variant="outline" size="sm">
					<span className="text-muted-foreground">⇧I</span>
					<span className="sr-only">All items</span>
					<ListIcon className="w-4 h-4" />
				</Button>
			</Link>
			<Link href="/progress" prefetch={false}>
				<Button variant="outline" size="sm">
					<span className="text-muted-foreground">⇧P</span>
					<span className="sr-only">Progress</span>
					<CheckCircleIcon className="w-4 h-4" />
				</Button>
			</Link>
		</div>
	);
}
