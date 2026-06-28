"use client";

import { memo, useEffect, useState } from "react";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { type OwnedMaterialEntry } from "./buildOwnedMaterials";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Props = {
  entry: OwnedMaterialEntry;
  owned: number;
  onCommit: (qty: number) => void;
};

export const OwnedMaterialRow = memo(function OwnedMaterialRow({
  entry,
  owned,
  onCommit,
}: Props) {
  const [inputValue, setInputValue] = useState(String(owned));
  const isDone = entry.needed > 0 && owned >= entry.needed;

  // Sync local input state when the store value changes externally (e.g. checkbox toggle, hydration).
  useEffect(() => {
    setInputValue(String(owned));
  }, [owned]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onCommit(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 0) setInputValue(String(owned));
  };

  return (
    <div
      className={`flex flex-row items-center gap-2 py-1.5 text-sm${isDone ? " opacity-40" : ""}`}
    >
      <Checkbox
        checked={isDone}
        onCheckedChange={(checked) => onCommit(checked ? entry.needed : 0)}
      />
      {entry.image && (
        <img
          src={createImageUrlPath(entry.image)}
          alt={entry.name}
          width={24}
          height={24}
          className="shrink-0 size-6 ml-2"
        />
      )}
      <Link href={`/item/${entry.itemId}`} className="flex items-center gap-1">
        <Button variant="outline" size="icon-xs" className="px-1 py-0.5">
          <ArrowRightIcon />
        </Button>
      </Link>
      
      {entry.wikiLink && (
      <a
        href={`https://dragonwilds.runescape.wiki/w/${encodeURIComponent(entry.wikiLink)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="icon-xs" className="px-1 py-0.5">
            <ArrowUpRight />
        </Button>
        </a>
      )}

      <InputGroup className="w-12 h-6">
        <InputGroupInput
          type="number"
          min={0}
          autoComplete="off"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="px-1 text-center"
        />
      </InputGroup>
      <span className={`font-semibold${isDone ? " line-through" : ""}`}>
        / {entry.needed}×
      </span>
      <span className={`flex-1${isDone ? " line-through" : ""}`}>
        {entry.name}
      </span>
    </div>
  );
});
