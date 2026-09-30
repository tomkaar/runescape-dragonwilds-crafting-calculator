"use client";

import { Check, TriangleAlert } from "lucide-react";
import { Fragment } from "react";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import type {
	ItemStepEntry,
	NeededMaterial,
	StepEntry,
} from "../utils/build-steps";

type StepRowEntry = Pick<StepEntry, "name" | "image">;

/** A step whose quantity is already covered - dimmed, with a check mark. */
export function CompletedStepRow({ step }: { step: StepRowEntry }) {
	return (
		<div className="flex items-center gap-2 py-2 text-sm opacity-50 first:pt-0">
			{step.image && (
				<img
					src={createImageUrlPath(step.image)}
					alt={step.name}
					width={20}
					height={20}
					className="shrink-0 size-5"
				/>
			)}
			<span className="font-semibold">{step.name}</span>
			<Check className="size-4 shrink-0 text-green-500" />
		</div>
	);
}

export function StepRow({
	step,
	showUsedFor,
	showNeeded,
}: {
	step: StepEntry | ItemStepEntry;
	showUsedFor: boolean;
	showNeeded: boolean;
}) {
	// Resolved ingredients first, then one "or" group per candidate recipe
	// for the part whose recipe hasn't been picked yet.
	const neededGroups = [
		...(step.needed.materials.length > 0 ? [step.needed.materials] : []),
		...step.needed.alternatives,
	];
	const alternativesStart =
		neededGroups.length - step.needed.alternatives.length;

	return (
		<div className="flex flex-col gap-0.5 py-2 text-sm first:pt-0 last:pb-0">
			<div className="flex items-center gap-2">
				{step.image && (
					<img
						src={createImageUrlPath(step.image)}
						alt={step.name}
						width={20}
						height={20}
						className="shrink-0 size-5"
					/>
				)}
				<span className="font-semibold">
					{step.quantity}× {step.name}
				</span>
			</div>
			{showNeeded && neededGroups.length > 0 && (
				<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
					<span>Required item{neededGroups.length > 1 ? "s" : ""}:</span>
					{neededGroups.map((group, groupIndex) => (
						<Fragment key={group.map((m) => m.itemId).join("|")}>
							{groupIndex > alternativesStart && (
								<span className="italic opacity-70">or</span>
							)}
							{groupIndex === alternativesStart && groupIndex > 0 && (
								<span className="italic opacity-70">+ one of</span>
							)}
							<NeededMaterialList materials={group} />
						</Fragment>
					))}
				</div>
			)}
			{showUsedFor && "parents" in step && step.parents.length > 0 && (
				<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
					<span>Used for:</span>
					{step.parents.map((p, i) => (
						<span key={p.itemId} className="flex items-center gap-1">
							{p.image && (
								<img
									src={createImageUrlPath(p.image)}
									alt={p.name}
									width={14}
									height={14}
									className="shrink-0"
								/>
							)}
							{p.quantity}× {p.name}
							{i < step.parents.length - 1 && ","}
						</span>
					))}
				</div>
			)}
			{"coverageWarnings" in step && step.coverageWarnings.length > 0 && (
				<div className="flex flex-col gap-0.5 pt-1 pl-7">
					{step.coverageWarnings.map((w) => (
						<div
							key={w.parentItemId}
							className="flex items-start gap-1 text-xs text-amber-500"
						>
							<TriangleAlert className="size-3.5 shrink-0 mt-0.5" />
							<span>
								{listFormatter.format(w.missingRoots.map((r) => r.name))}{" "}
								{w.missingRoots.length === 1 ? "needs" : "need"} {w.parentName}{" "}
								too, but {w.missingRoots.length === 1 ? "hasn't" : "haven't"}{" "}
								marked this material as a step — this total may be higher than
								currently shown.
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function NeededMaterialList({ materials }: { materials: NeededMaterial[] }) {
	return materials.map((m, i) => (
		<span key={m.itemId} className="flex items-center gap-1">
			{m.image && (
				<img
					src={createImageUrlPath(m.image)}
					alt={m.name}
					width={14}
					height={14}
					className="shrink-0"
				/>
			)}
			{m.quantity}× {m.name}
			{i < materials.length - 1 && ","}
		</span>
	));
}

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});
