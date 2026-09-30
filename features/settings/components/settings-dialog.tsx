"use client";

import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type Direction,
	isSettingsEqual,
	pickSettings,
	type SettingsState,
	useSettings,
	withFacilitiesOwned,
	withoutSkill,
	withSkillLevel,
	withSkillXp,
} from "@/store/settings";
import { FacilitiesEditor } from "./facilities-editor";
import { NextStepsPreview } from "./next-steps-preview";
import { SkillLevelsEditor } from "./skill-levels-editor";

type SettingsTab = "next-steps" | "experience" | "facilities" | "crafting-tree";

type Props = {
	/** Tab shown when the dialog opens. */
	defaultTab?: SettingsTab;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	// Optional trigger, omit when the dialog is controlled from elsewhere
	children?: ReactNode;
};

export function SettingsDialog({
	defaultTab = "next-steps",
	open,
	onOpenChange,
	children,
}: Props) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = open ?? internalOpen;

	const handleOpenChange = (value: boolean) => {
		setInternalOpen(value);
		onOpenChange?.(value);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						All your preferences in one place. Changes are applied when you
						press Save.
					</DialogDescription>
				</DialogHeader>
				{/* Mounted only while open, so every open starts a fresh draft. */}
				<SettingsForm
					defaultTab={defaultTab}
					onDone={() => handleOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

function SettingsForm({
	defaultTab,
	onDone,
}: {
	defaultTab: SettingsTab;
	onDone: () => void;
}) {
	const applySettings = useSettings((state) => state.applySettings);
	const [saved] = useState(() => pickSettings(useSettings.getState()));
	const [draft, setDraft] = useState(saved);

	const update = (patch: Partial<SettingsState>) =>
		setDraft((current) => ({ ...current, ...patch }));

	const updateNextSteps = (patch: Partial<SettingsState["nextSteps"]>) =>
		update({ nextSteps: { ...draft.nextSteps, ...patch } });

	const onSave = () => {
		applySettings(draft);
		onDone();
	};

	return (
		<>
			<Tabs defaultValue={defaultTab} className="w-full">
				<TabsList className="w-full justify-start overflow-x-auto">
					<TabsTrigger value="next-steps" className="min-w-fit">
						Next Steps
					</TabsTrigger>
					<TabsTrigger value="experience" className="min-w-fit">
						Experience
					</TabsTrigger>
					<TabsTrigger value="facilities" className="min-w-fit">
						Facilities
					</TabsTrigger>
					<TabsTrigger value="crafting-tree" className="min-w-fit">
						Crafting Tree
					</TabsTrigger>
				</TabsList>

				<TabsContent value="next-steps" className={panelClassName}>
					<TabIntro>
						Controls how rows in the Next Steps list on the Progress page are
						displayed.
					</TabIntro>
					<NextStepsPreview options={draft.nextSteps} />
					<FieldGroup className="gap-5">
						<CheckboxField
							id="settings-show-covered"
							label="Show completed steps"
							description="Keep steps you've already gathered enough of in the list, dimmed with a check mark. Off hides them so only remaining work is shown."
							checked={draft.nextSteps.showCovered}
							onCheckedChange={(showCovered) =>
								updateNextSteps({ showCovered })
							}
						/>
						<CheckboxField
							id="settings-show-needed"
							label="Show required items"
							description="List the ingredients each step consumes, including 'one of' alternatives when a recipe hasn't been picked yet."
							checked={draft.nextSteps.showNeeded}
							onCheckedChange={(showNeeded) => updateNextSteps({ showNeeded })}
						/>
						<CheckboxField
							id="settings-show-used-for"
							label="Show 'Used for'"
							description="Show which parent items each material goes into, and how many of each."
							checked={draft.nextSteps.showUsedFor}
							onCheckedChange={(showUsedFor) =>
								updateNextSteps({ showUsedFor })
							}
						/>
					</FieldGroup>
				</TabsContent>

				<TabsContent value="experience" className={panelClassName}>
					<TabIntro>
						Your current skill levels are used to show progress toward your next
						level from the XP your plan earns.
					</TabIntro>
					<CheckboxField
						id="settings-show-only-gained"
						label="Hide skills without XP"
						description="Only list skills your current plan actually grants experience in."
						checked={draft.experienceSummary.showOnlyGained}
						onCheckedChange={(showOnlyGained) =>
							update({ experienceSummary: { showOnlyGained } })
						}
					/>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-sm font-medium">Skill levels</span>
							<p className="text-sm text-muted-foreground">
								Enter your current level or exact XP per skill. Level uses that
								level's starting XP, exact XP is optional, and clearing a skill
								removes it from the summary.
							</p>
						</div>
						<SkillLevelsEditor
							levels={draft.skills.levels}
							setLevel={(skill, level) =>
								update(withSkillLevel(draft, skill, level))
							}
							setXp={(skill, xp) => update(withSkillXp(draft, skill, xp))}
							clearSkill={(skill) => update(withoutSkill(draft, skill))}
						/>
					</div>
				</TabsContent>

				<TabsContent value="facilities" className={panelClassName}>
					<TabIntro>
						Check off facilities you've already unlocked or built. Owned
						facilities move to the 'Owned' section of the Facility Checklist.
						Applies across all plans.
					</TabIntro>
					<FacilitiesEditor
						owned={draft.facilities.owned}
						setOwned={(facility, owned) =>
							update(withFacilitiesOwned(draft, [facility], owned))
						}
						setAllOwned={(facilities, owned) =>
							update(withFacilitiesOwned(draft, facilities, owned))
						}
					/>
				</TabsContent>

				<TabsContent value="crafting-tree" className={panelClassName}>
					<TabIntro>Layout of the crafting tree on item pages.</TabIntro>
					<RadioGroup
						value={draft.craftingTree.direction}
						onValueChange={(value) =>
							update({ craftingTree: { direction: value as Direction } })
						}
						className="gap-5"
					>
						<RadioField
							id="settings-direction-tb"
							value="TB"
							label="Top to bottom"
							description="Finished item at the top, raw materials below."
						/>
						<RadioField
							id="settings-direction-lr"
							value="LR"
							label="Left to right"
							description="Finished item on the left, materials branching right."
						/>
					</RadioGroup>
				</TabsContent>
			</Tabs>

			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<Button onClick={onSave} disabled={isSettingsEqual(saved, draft)}>
					Save
				</Button>
			</DialogFooter>
		</>
	);
}

// Fixed height so switching tabs doesn't resize the dialog. `flex-none`
// overrides TabsContent's `flex-1`, whose 0% basis would otherwise size the
// panel to its content and ignore the height.
const panelClassName =
	"flex h-[60vh] flex-none flex-col gap-6 overflow-y-auto pt-2 pr-1";

function TabIntro({ children }: { children: ReactNode }) {
	return <p className="text-sm text-muted-foreground">{children}</p>;
}

function CheckboxField({
	id,
	label,
	description,
	checked,
	onCheckedChange,
}: {
	id: string;
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<Field orientation="horizontal">
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={(value) => onCheckedChange(value === true)}
			/>
			<FieldContent>
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<FieldDescription>{description}</FieldDescription>
			</FieldContent>
		</Field>
	);
}

function RadioField({
	id,
	value,
	label,
	description,
}: {
	id: string;
	value: Direction;
	label: string;
	description: string;
}) {
	return (
		<Field orientation="horizontal">
			<RadioGroupItem id={id} value={value} />
			<FieldContent>
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<FieldDescription>{description}</FieldDescription>
			</FieldContent>
		</Field>
	);
}
