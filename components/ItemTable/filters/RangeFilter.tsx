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
        className="w-16 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <span className="text-sm text-muted-foreground">–</span>

      <input
        type="number"
        min={0}
        value={max ?? ""}
        onChange={(e) =>
          onChange([min, e.target.value ? Number(e.target.value) : undefined])
        }
        placeholder="Max"
        className="w-16 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
