import { Badge } from "../../ui/badge";

type Props = {
  weight: number | undefined;
};

export function WeightBadge({ weight }: Props) {
  if (weight == null) return null;

  return (
    <Badge variant="secondary" className="text-sm">
      Weight: {weight}
    </Badge>
  );
}
