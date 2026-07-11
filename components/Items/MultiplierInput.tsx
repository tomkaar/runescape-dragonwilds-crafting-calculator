"use client"

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = { itemId: string }

export function MultiplierInput({ itemId }: Props) {
    const multipliers = useMaterialMultiplier((state) => state.items);
    const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
    const multiplier = multipliers[itemId] || 1;

    const [inputValue, setInputValue] = useState(String(multiplier));

    // Keep local state in sync when the store value changes externally
    useEffect(() => {
        setInputValue(String(multiplier));
    }, [multiplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 1000) {
            setMultiplier(itemId, parsed);
        }
    };

    const handleBlur = () => {
        const parsed = parseInt(inputValue, 10);
        if (isNaN(parsed) || parsed < 1) {
            setInputValue(String(multiplier));
        }
    };

    return (
        <Input
            id="input-multiplier"
            type="number"
            autoComplete="off"
            className="flex-1 w-20"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    )
}
