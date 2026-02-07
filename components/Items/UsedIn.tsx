"use client";

import { Hammer } from "lucide-react";
import { getUsedIn } from "@/utils/getUsedIn";
import Link from "next/link";
import Image from "next/image";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  CollapsiblePanelDesktop,
  CollapsiblePanelMobile,
} from "@/components/collapsible-panel";

type Props = {
  itemId: string;
  variant?: "desktop" | "mobile";
};

export function UsedIn(props: Props) {
  const { variant = "desktop" } = props;
  const usedIn = getUsedIn(props.itemId);

  const title = `Used In (${usedIn.length})`;

  const content = (
    <div className="px-4">
      <Context usedIn={usedIn} />
    </div>
  );

  const PanelComponent =
    variant === "mobile" ? CollapsiblePanelMobile : CollapsiblePanelDesktop;

  return (
    <PanelComponent id="used-in" title={title} icon={Hammer}>
      {content}
    </PanelComponent>
  );
}

type ContentProps = {
  usedIn: { id: string; name: string; image: string | null }[];
};

function Context(props: ContentProps) {
  const { usedIn } = props;

  return (
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
  );
}
