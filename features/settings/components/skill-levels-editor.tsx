"use client";

import { Eraser } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { levelForXp, MAX_LEVEL } from "@/domain/experience/experience-table";
import type { SkillLevelEntry } from "@/domain/experience/level-progress";
import { Skill } from "@/Types";
import { getSkillImageUrl } from "@/utils/getSkillImageUrl";

type SkillName = (typeof Skill)[number];

type EditorProps = {
	levels: Partial<Record<SkillName, SkillLevelEntry>>;
	setLevel: (skill: SkillName, level: number) => void;
	setXp: (skill: SkillName, xp: number) => void;
	clearSkill: (skill: SkillName) => void;
};

function SkillLevelRow({
	skill,
	entry,
	setLevel,
	setXp,
	clearSkill,
}: Omit<EditorProps, "levels"> & {
	skill: SkillName;
	entry: SkillLevelEntry | undefined;
}) {
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

/** One row per skill; the caller decides whether edits apply right away or to a draft. */
export function SkillLevelsEditor({ levels, ...actions }: EditorProps) {
	return (
		<div className="flex flex-col gap-3">
			{Skill.map((skill) => (
				<SkillLevelRow
					key={skill}
					skill={skill}
					entry={levels[skill]}
					{...actions}
				/>
			))}
		</div>
	);
}
