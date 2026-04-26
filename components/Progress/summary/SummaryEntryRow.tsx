"use client";

import { memo } from "react";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

import { type SummaryEntry } from "./buildSummary";

type Props = {
  entry: SummaryEntry;
  done?: boolean;
};

export const SummaryEntryRow = memo(function SummaryEntryRow({
  entry,
  done = false,
}: Props) {
  const qty = done ? entry.doneQty : entry.todoQty;

  return (
    <div
      className={`flex flex-row items-center gap-2 py-1.5 text-sm${done ? " opacity-40" : ""}`}
    >
      {entry.image && (
        <img
          src={createImageUrlPath(entry.image)}
          alt={entry.name}
          width={20}
          height={20}
          className="shrink-0"
        />
      )}
      <span className={`font-semibold${done ? " line-through" : ""}`}>
        {qty}×
      </span>
      <span className={`flex-1${done ? " line-through" : ""}`}>{entry.name}</span>
    </div>
  );
});
