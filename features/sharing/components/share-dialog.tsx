"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import {
	decodeShareCode,
	encodeShareCode,
	type ShareData,
} from "../utils/share-code";

type Props = {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	// Optional trigger, omit when the dialog is controlled from elsewhere
	children?: ReactNode;
};

export function ShareDialog({ open, onOpenChange, children }: Props) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = open ?? internalOpen;

	const handleOpenChange = (value: boolean) => {
		setInternalOpen(value);
		onOpenChange?.(value);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Share progress</DialogTitle>
					<DialogDescription>
						Export your tracked items to move them to another device, or import
						a code from another device.
					</DialogDescription>
				</DialogHeader>
				<ExportSection />
				<ImportSection onImported={() => handleOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}

function describeShareData(data: ShareData) {
	const items = Object.keys(data.selectedMaterials).length;
	const multipliers = Object.keys(data.materialMultipliers).length;
	return `${items} tracked item${items === 1 ? "" : "s"}, ${multipliers} multiplier${multipliers === 1 ? "" : "s"}`;
}

function ExportSection() {
	const selectedMaterials = useSelectedMaterial((state) => state.items);
	const materialMultipliers = useMaterialMultiplier((state) => state.items);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [copied, setCopied] = useState(false);

	const isEmpty = Object.keys(selectedMaterials).length === 0;
	const code = useMemo(
		() =>
			isEmpty
				? ""
				: encodeShareCode({
						version: 1,
						selectedMaterials,
						materialMultipliers,
					}),
		[isEmpty, selectedMaterials, materialMultipliers],
	);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timeout);
	}, [copied]);

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			textareaRef.current?.select();
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between">
				<Label htmlFor="share-export">Export</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={isEmpty}
					onClick={onCopy}
				>
					{copied ? <CheckIcon /> : <CopyIcon />}
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
			<Textarea
				ref={textareaRef}
				id="share-export"
				readOnly
				value={code}
				placeholder="Nothing to export yet"
				onFocus={(event) => event.currentTarget.select()}
				className="max-h-32 break-all font-mono text-xs md:text-xs"
			/>
		</div>
	);
}

function ImportSection({ onImported }: { onImported: () => void }) {
	const [code, setCode] = useState("");
	const result = useMemo(
		() => (code.trim() ? decodeShareCode(code) : null),
		[code],
	);

	const onImport = () => {
		if (!result?.success) return;
		useSelectedMaterial.setState({ items: result.data.selectedMaterials });
		useMaterialMultiplier.setState({ items: result.data.materialMultipliers });
		setCode("");
		onImported();
	};

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="share-import">Import</Label>
			<Textarea
				id="share-import"
				value={code}
				onChange={(event) => setCode(event.target.value)}
				placeholder="Paste a share code"
				aria-invalid={result ? !result.success : undefined}
				aria-describedby="share-import-status"
				className="max-h-32 break-all font-mono text-xs md:text-xs"
			/>
			<p
				id="share-import-status"
				aria-live="polite"
				className={cn(
					"text-xs min-h-4",
					result?.success ? "text-muted-foreground" : "text-destructive",
				)}
			>
				{result &&
					(result.success
						? `Valid — ${describeShareData(result.data)}`
						: result.error)}
			</p>
			<div className="flex flex-row items-center justify-between gap-4">
				<p className="text-xs text-muted-foreground">
					This will replace your current progress.
				</p>
				<Button
					type="button"
					size="sm"
					disabled={!result?.success}
					onClick={onImport}
				>
					Import
				</Button>
			</div>
		</div>
	);
}
