"use client";

import { Eraser, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { levelForXp, MAX_LEVEL } from "@/domain/experience/experience-table";
import { useSkillLevels } from "@/store/skill-levels";
import { Skill } from "@/Types";
import { getSkillImageUrl } from "@/utils/getSkillImageUrl";

function SkillLevelRow({ skill }: { skill: (typeof Skill)[number] }) {
	const entry = useSkillLevels((state) => state.levels[skill]);
	const setLevel = useSkillLevels((state) => state.setLevel);
	const setXp = useSkillLevels((state) => state.setXp);
	const clearSkill = useSkillLevels((state) => state.clearSkill);

	const [levelInput, setLevelInput] = useState(
		entry ? String(levelForXp(entry.xp)) : "",
	);
	const [xpInput, setXpInput] = useState(entry ? String(entry.xp) : "");

	useEffect(() => {
		setLevelInput(entry ? String(levelForXp(entry.xp)) : "");
		setXpInput(entry ? String(entry.xp) : "");
	}, [entry]);

	const onLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setLevelInput(raw);
		if (raw === "") return;
		const parsed = parseInt(raw, 10);
		if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= MAX_LEVEL) {
			setLevel(skill, parsed);
		}
	};

	const onLevelBlur = () => {
		if (levelInput === "") return;
		const parsed = parseInt(levelInput, 10);
		if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_LEVEL) {
			setLevelInput(entry ? String(levelForXp(entry.xp)) : "");
		}
	};

	const onXpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setXpInput(raw);
		if (raw === "") return;
		const parsed = parseInt(raw, 10);
		if (!Number.isNaN(parsed) && parsed >= 0) {
			setXp(skill, parsed);
		}
	};

	const onXpBlur = () => {
		if (xpInput === "") return;
		const parsed = parseInt(xpInput, 10);
		if (Number.isNaN(parsed) || parsed < 0) {
			setXpInput(entry ? String(entry.xp) : "");
		}
	};

	return (
		<div className="flex items-center gap-2">
			<img
				src={getSkillImageUrl(skill)}
				alt={skill}
				width={20}
				height={20}
				className="shrink-0"
			/>
			<span className="flex-1 text-sm font-medium">{skill}</span>

			<Input
				id={`level-${skill}`}
				type="number"
				inputMode="numeric"
				autoComplete="off"
				placeholder="Level"
				aria-label={`${skill} level`}
				className="w-20"
				value={levelInput}
				onChange={onLevelChange}
				onBlur={onLevelBlur}
			/>

			<Input
				id={`xp-${skill}`}
				type="number"
				inputMode="numeric"
				autoComplete="off"
				placeholder="XP (optional)"
				aria-label={`${skill} exact XP`}
				className="w-36"
				value={xpInput}
				onChange={onXpChange}
				onBlur={onXpBlur}
			/>

			<Button
				variant="outline"
				size="icon"
				aria-label={`Clear ${skill} level`}
				disabled={!entry}
				onClick={() => clearSkill(skill)}
			>
				<Eraser className="w-4 h-4" />
			</Button>
		</div>
	);
}

export function SkillLevelsDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5">
					<Gauge className="w-4 h-4" />
					Set levels
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Skill levels</DialogTitle>
					<DialogDescription>
						Enter your current level or exact XP per skill to see progress
						toward your next level from the plan's XP. Either field works on its
						own — level uses that level's starting XP, and the other field
						updates to match whichever you enter.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					{Skill.map((skill) => (
						<SkillLevelRow key={skill} skill={skill} />
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
