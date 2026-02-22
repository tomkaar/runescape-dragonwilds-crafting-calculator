"use client";

import { getUsedIn } from "@/utils/getUsedIn";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import Link from "@/components/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  itemId: string;
};

export function UsedInContent(props: Props) {
  const usedIn = getUsedIn(props.itemId);

  return (
    <div className="px-4">
      <ul className="flex flex-row gap-2 flex-wrap">
        {usedIn.length === 0 && (
          <li className="text-sm text-neutral-500">Not used in any recipes</li>
        )}
        {usedIn
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => (
            <li key={item.id} className="flex">
              <Badge asChild variant="secondary" className="text-sm">
                <Link href={{ pathname: `/item/${item.id}` }}>
                  {item.image && (
                    <img
                      src={createImageUrlPath(item.image)}
                      width={22}
                      height={22}
                      alt={item.name}
                      data-icon="inline-start"
                    />
                  )}
                  {item.name}
                </Link>
              </Badge>
              {/* <Link
                href={{ pathname: `/item/${item.id}` }}
                className="bg-neutral-800 text-sm rounded-lg pl-1 pr-3 py-1 flex flex-row gap-1 items-center"
              >
                {item.image && (
                  <img
                    src={createImageUrlPath(item.image)}
                    width={20}
                    height={20}
                    alt={item.name}
                  />
                )}
                {item.name}
              </Link> */}
            </li>
          ))}
      </ul>
    </div>
  );
}
