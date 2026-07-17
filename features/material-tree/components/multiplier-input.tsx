"use client";

import { Input } from "@/components/ui/input";
import { useClampedNumberInput } from "@/hooks/useClampedNumberInput";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = { itemId: string };

export function MultiplierInput({ itemId }: Props) {
	const multipliers = useMaterialMultiplier((state) => state.items);
	const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
	const multiplier = multipliers[itemId] || 1;

	const { inputValue, onChange, onBlur } = useClampedNumberInput({
		value: multiplier,
		onCommit: (parsed) => setMultiplier(itemId, parsed),
		min: 1,
		max: 1000,
	});

	return (
		<Input
			id="input-multiplier"
			type="number"
			autoComplete="off"
			className="flex-1 w-20"
			value={inputValue}
			onChange={onChange}
			onBlur={onBlur}
		/>
	);
}
