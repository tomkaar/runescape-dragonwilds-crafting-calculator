"use client";

import { memo } from "react";
import { Circle, CircleCheck } from "lucide-react";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useSelectedMaterial } from "@/store/selected-material";
import { cn } from "@/lib/utils";

import { type StepEntry } from "./types";

type Props = {
  step: StepEntry;
  compact?: boolean;
};

export const StepRow = memo(function StepRow({ step, compact = false }: Props) {
  const markAsDoneByNodeId = useSelectedMaterial(
    (state) => state.markAsDoneByNodeId,
  );
  const markAsTodoByNodeId = useSelectedMaterial(
    (state) => state.markAsTodoByNodeId,
  );
  const isDone = step.state === "DONE";

  return (
    <div
      className={cn("flex items-start gap-2 py-1.5", isDone && "opacity-40")}
    >
      <button
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() =>
          isDone
            ? markAsTodoByNodeId(step.trackedItemId, step.nodeId)
            : markAsDoneByNodeId(step.trackedItemId, step.nodeId)
        }
      >
        {isDone ? (
          <CircleCheck className="size-6 text-title" />
        ) : (
          <Circle className="size-6" />
        )}
      </button>
      <p className={cn("text-sm leading-relaxed", isDone && "line-through")}>
        {!compact && (
          <>
            {"For "}
            {step.parent.image && (
              <img
                src={createImageUrlPath(step.parent.image)}
                alt={step.parent.name}
                width={14}
                height={14}
                className="inline-block align-middle mx-0.5"
              />
            )}
            <span className="font-semibold">
              {step.parent.quantity}× {step.parent.name}
            </span>
            {", I need "}
          </>
        )}
        {step.image && (
          <img
            src={createImageUrlPath(step.image)}
            alt={step.name}
            width={14}
            height={14}
            className="inline-block align-middle mx-0.5"
          />
        )}
        <span className="font-semibold">
          {step.quantity}× {step.name}
        </span>
      </p>
    </div>
  );
});
