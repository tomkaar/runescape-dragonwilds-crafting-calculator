"use client";

import {
	CompletedStepRow,
	StepRow,
} from "@/features/crafting-progress/components/step-row";
import type { StepEntry } from "@/features/crafting-progress/utils/build-steps";
import type { SettingsState } from "@/store/settings";

// Fixed sample so every option has a visible effect, even with no plan yet.
const sampleStep: StepEntry = {
	itemId: "bronze-bar",
	name: "Bronze Bar",
	image: "Bronze Bar.png",
	quantity: 4,
	parents: [
		{
			itemId: "bronze-pickaxe",
			name: "Bronze Pickaxe",
			image: "Bronze Pickaxe.png",
			quantity: 1,
		},
		{
			itemId: "bronze-dagger",
			name: "Bronze Dagger",
			image: "Bronze Dagger.png",
			quantity: 1,
		},
	],
	usedFor: [],
	depth: 1,
	hasChildren: true,
	facilities: ["Furnace"],
	needed: {
		materials: [
			{
				itemId: "copper-ore",
				name: "Copper Ore",
				image: "Copper Ore.png",
				quantity: 6,
			},
			{
				itemId: "tin-ore",
				name: "Tin Ore",
				image: "Tin Ore.png",
				quantity: 6,
			},
		],
		alternatives: [],
	},
	covered: false,
};

const sampleCompletedStep = { name: "Oak Logs", image: "Oak Logs.png" };

type Props = {
	options: SettingsState["nextSteps"];
};

export function NextStepsPreview({ options }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-xs font-semibold text-muted-foreground">
				Preview
			</span>
			<div
				className="rounded-lg border border-accent bg-background p-4"
				aria-hidden="true"
			>
				<div className="flex flex-col divide-y divide-accent">
					<StepRow
						step={sampleStep}
						showUsedFor={options.showUsedFor}
						showNeeded={options.showNeeded}
					/>
					{options.showCovered && (
						<div className="pt-2">
							<CompletedStepRow step={sampleCompletedStep} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
