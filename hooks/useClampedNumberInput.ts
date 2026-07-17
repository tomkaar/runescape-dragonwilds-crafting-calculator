"use client";

import { useEffect, useState } from "react";

type Args = {
	value: number;
	onCommit: (value: number) => void;
	min?: number;
	max?: number;
};

/**
 * Local-state wrapper for a numeric <input>: mirrors an external value,
 * commits parsed changes while they fall within [min, max], and reverts to
 * the last committed value on blur if left below min or otherwise invalid.
 */
export function useClampedNumberInput({
	value,
	onCommit,
	min = 0,
	max = Infinity,
}: Args) {
	const [inputValue, setInputValue] = useState(String(value));

	// Sync local input state when the external value changes (e.g. hydration, other inputs).
	useEffect(() => {
		setInputValue(String(value));
	}, [value]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setInputValue(raw);
		const parsed = parseInt(raw, 10);
		if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
			onCommit(parsed);
		}
	};

	const onBlur = () => {
		const parsed = parseInt(inputValue, 10);
		if (Number.isNaN(parsed) || parsed < min) setInputValue(String(value));
	};

	return { inputValue, onChange, onBlur };
}
