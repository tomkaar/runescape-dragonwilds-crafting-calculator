import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSearchAndNavigation } from "@/features/command/context/search-and-navigation";

const instructions = [
	{
		text: 'Search for an item and click on "Add to progress" to add it to the list',
	},
	{
		text: "Select the materials you need to collect for the item.",
	},
	{
		text: "Mark the materials as collected once you have them.",
	},
	{
		text: "See next steps based on your progress.",
	},
];

export default function Instruction() {
	const { setOpen } = useSearchAndNavigation();

	return (
		<div className="bg-dark-background">
			<div className="mx-auto flex max-w-4xl flex-col gap-4">
				<AccordionPersisted>
					<AccordionItem
						value="progress-instruction"
						className="bg-background rounded-lg border border-accent"
					>
						<AccordionTrigger className="text-foreground px-4">
							<div className="flex flex-col text-left">
								<span className="font-semibold text-sm">Progress tracker</span>
								<span className="text-xs text-muted-foreground font-normal mt-0.5 max-w-md">
									Track crafting progress across every item you&apos;re working
									towards.
								</span>
							</div>
						</AccordionTrigger>

						<AccordionContent className="px-4 pb-4 text-foreground">
							<ul className="list-decimal list-inside text-xs">
								{instructions.map((instruction) => (
									<li key={instruction.text}>
										<p className="inline text-xs text-muted-foreground mt-0.5 max-w-md">
											{instruction.text}
										</p>
									</li>
								))}
							</ul>

							<div className="mt-2">
								<p className="text-xs text-muted-foreground mt-0.5 max-w-md">
									If you have multiple items in progress, you can use the filter
									to quickly find the item you want to focus on.
								</p>
							</div>
							<div className="mt-2">
								<p className="text-xs text-muted-foreground mt-0.5 max-w-md">
									See the required facilities and tools needed for crafting each
									item.
								</p>
							</div>
							<div className="mt-4 flex flex-row flex-wrap gap-2">
								<div className="flex-1 min-w-48">
									<Button
										onClick={() => setOpen(true)}
										variant="outline"
										className="w-full"
									>
										<span className="text-muted-foreground">⌘K</span> Search and
										navigate
									</Button>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</AccordionPersisted>
			</div>
		</div>
	);
}
