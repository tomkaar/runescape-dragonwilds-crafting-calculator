import { Badge } from "../../ui/badge";

type Props = {
  stackLimit: number | undefined;
};

export function StackLimitBadge({ stackLimit }: Props) {
  if (stackLimit == null) return null;

  return (
    <Badge variant="secondary" className="text-sm">
      Stack: {stackLimit}
    </Badge>
  );
}
