"use client";

type Props = {
  min: number | undefined;
  max: number | undefined;
  onChange: (range: [number | undefined, number | undefined]) => void;
};

export function RangeFilter({ min, max, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={min ?? ""}
        onChange={(e) =>
          onChange([e.target.value ? Number(e.target.value) : undefined, max])
        }
        placeholder="Min"
        className="w-16 rounded-md border border-neutral-700 bg-background px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      />
      <span className="text-sm text-neutral-400">–</span>

      <input
        type="number"
        min={0}
        value={max ?? ""}
        onChange={(e) =>
          onChange([min, e.target.value ? Number(e.target.value) : undefined])
        }
        placeholder="Max"
        className="w-16 rounded-md border border-neutral-700 bg-background px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      />
    </div>
  );
}
