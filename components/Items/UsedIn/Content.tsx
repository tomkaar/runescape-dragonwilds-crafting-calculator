"use client";

import { getUsedIn } from "@/utils/getUsedIn";
import Link from "next/link";
import Image from "next/image";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

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
              <Link
                prefetch={false}
                href={{ pathname: `/item/${item.id}` }}
                className="bg-neutral-800 text-sm rounded-lg pl-1 pr-3 py-1 flex flex-row gap-1 items-center"
              >
                {item.image && (
                  <Image
                    src={createImageUrlPath(item.image)}
                    width={20}
                    height={20}
                    alt={item.name}
                  />
                )}
                {item.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
