"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { AccordionPersisted } from "@/components/accordion-persisted";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { buildLevelProgress } from "@/domain/experience/level-progress";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import type { SelectedMaterial } from "@/store/selected-material";
import { useSkillLevels } from "@/store/skill-levels";
import { useStepsFilter } from "@/store/steps-filter";

import { getSkillImageUrl } from "@/utils/getSkillImageUrl";
import { useTrackedItemIds } from "../hooks/useTrackedItemIds";
import { buildExperienceSummary } from "../utils/experience-summary";
import { SkillLevelsDialog } from "./skill-levels-dialog";

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

type Props = {
	allItems: Record<string, SelectedMaterial[]>;
};

export function ExperienceSummary({ allItems }: Props) {
	const trackedItemIds = useTrackedItemIds(allItems);
	const multipliers = useMaterialMultiplier((state) => state.items);
	const owned = useMaterialOwned((state) => state.owned);
	const { isAll, selectedIds } = useStepsFilter();
	const skillLevels = useSkillLevels((state) => state.levels);

	const filteredItemIds = useMemo(
		() =>
			isAll
				? trackedItemIds
				: selectedIds.filter((id) => trackedItemIds.includes(id)),
		[isAll, selectedIds, trackedItemIds],
	);

	const { totals, ambiguousItemNames } = useMemo(
		() =>
			buildExperienceSummary({ filteredItemIds, allItems, multipliers, owned }),
		[filteredItemIds, allItems, multipliers, owned],
	);

	const levelProgress = useMemo(
		() => buildLevelProgress(skillLevels, totals),
		[skillLevels, totals],
	);
	const levelProgressBySkill = useMemo(
		() => new Map(levelProgress.map((entry) => [entry.skill, entry])),
		[levelProgress],
	);
	const totalsBySkill = useMemo(
		() => new Map(totals.map((entry) => [entry.skill, entry.experience])),
		[totals],
	);
	// Skills with a level set but no XP contribution from the current plan
	// still get a row (flat progress) — presence of a level is what decides
	// visibility, not whether the plan happens to touch that skill.
	const displaySkills = useMemo(() => {
		const seen = new Set(totals.map((entry) => entry.skill));
		const skillsOnlyFromLevels = levelProgress
			.map((entry) => entry.skill)
			.filter((skill) => !seen.has(skill));
		return [...totals.map((entry) => entry.skill), ...skillsOnlyFromLevels];
	}, [totals, levelProgress]);

	return (
		<AccordionPersisted>
			<AccordionItem
				value="progress-experience"
				className="bg-background rounded-lg border border-accent"
			>
				<AccordionTrigger className="text-foreground px-4">
					<div className="flex flex-col text-left">
						<span className="font-semibold text-sm">Experience Gained</span>
						<span className="text-xs text-muted-foreground font-normal mt-0.5">
							XP you'll earn from crafting everything in your next steps.
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent className="px-4 pb-4 text-foreground pt-4 flex flex-col gap-3">
					{displaySkills.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							No experience to show yet — mark materials as todo on the item
							cards, or none of your planned crafts grant skill experience.
						</p>
					) : (
						<div className="flex flex-col divide-y divide-accent">
							{displaySkills.map((skill) => {
								const experience = totalsBySkill.get(skill);
								const progress = levelProgressBySkill.get(skill);
								const levelsGained = progress
									? progress.newLevel - progress.startLevel
									: 0;

								return (
									<div
										key={skill}
										className="flex flex-col gap-1.5 py-2 text-sm first:pt-0 last:pb-0"
									>
										<div className="flex items-center justify-between">
											<span className="flex items-center gap-2 font-semibold">
												<img
													src={getSkillImageUrl(skill)}
													alt={skill}
													width={20}
													height={20}
													className="shrink-0"
												/>
												{skill}
											</span>
											{experience !== undefined && (
												<span className="text-muted-foreground">
													{experience.toLocaleString()} XP
												</span>
											)}
										</div>

										{progress && (
											<div className="flex flex-col gap-1 pl-7">
												<div className="flex items-center justify-between text-xs text-muted-foreground">
													<span>
														{levelsGained > 0
															? `Level ${progress.startLevel} → ${progress.newLevel} (+${levelsGained})`
															: `Level ${progress.newLevel}`}
													</span>
													{!progress.isMaxed && (
														<span>
															{Math.round(progress.progressPercent)}% to{" "}
															{progress.newLevel + 1}
														</span>
													)}
												</div>
												{progress.isMaxed ? (
													<span className="text-xs font-medium text-amber-500">
														Maxed
													</span>
												) : (
													<>
														<Progress
															value={progress.progressPercent}
															className="h-1.5"
														/>
														{progress.nextLevelXp !== null && (
															<div className="flex items-center justify-between text-[11px] text-muted-foreground/80">
																<span>
																	{progress.newXp.toLocaleString()} /{" "}
																	{progress.nextLevelXp.toLocaleString()} XP
																</span>
																<span>
																	{(
																		progress.nextLevelXp - progress.newXp
																	).toLocaleString()}{" "}
																	XP left
																</span>
															</div>
														)}
													</>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}

					{ambiguousItemNames.length > 0 && (
						<div className="flex items-start gap-1.5 text-xs text-amber-500">
							<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
							<span>
								Experience may not be accurate for{" "}
								{listFormatter.format(ambiguousItemNames)} — multiple recipes
								are selected for the same item.
							</span>
						</div>
					)}

					<div className="flex justify-start">
						<SkillLevelsDialog />
					</div>
				</AccordionContent>
			</AccordionItem>
		</AccordionPersisted>
	);
}
