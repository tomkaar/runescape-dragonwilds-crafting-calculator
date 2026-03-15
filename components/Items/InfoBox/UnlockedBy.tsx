import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../ui/badge";

type Props = {
  usesRecipes: string[];
};

export function UnlockedBy({ usesRecipes }: Props) {
  if (usesRecipes.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 mt-2">
      <span className="block text-sm">Unlocked by: </span>
      {usesRecipes.map((recipeName) => (
        <Badge
          key={recipeName}
          asChild
          variant="secondary"
          className="text-sm gap-1"
        >
          <Link
            href={`https://dragonwilds.runescape.wiki/w/${recipeName.replace(/ /g, "_")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {recipeName}
            <ArrowUpRight width={12} height={12} data-icon="inline-end" />
          </Link>
        </Badge>
      ))}
    </div>
  );
}
