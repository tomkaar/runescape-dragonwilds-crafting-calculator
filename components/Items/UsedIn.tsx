"use client";

import { Hammer } from "lucide-react";
import { getUsedIn } from "@/utils/getUsedIn";
import Link from "next/link";
import Image from "next/image";
import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef } from "react";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type Props = {
  itemId: string;
};

export function UsedIn(props: Props) {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);
  const usedIn = getUsedIn(props.itemId);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.expand();
        panelRef.current.resize(
          contentHeight ? contentHeight + 52 + 20 : "50%",
        );
      } else {
        panelRef.current.collapse();
      }
    }
  };

  return (
    <Panel
      id="used-in"
      panelRef={panelRef}
      minSize={52}
      collapsible
      collapsedSize={52}
      className="bg-neutral-950 rounded-lg"
    >
      <button
        onClick={togglePanel}
        className="cursor-pointer w-full flex flex-row items-center gap-2 px-4 py-4 text-sm"
      >
        <Hammer className="w-4 h-4 text-neutral-600 fill-neutral-600" />
        Used In ({usedIn.length})
      </button>
      <div className="px-4 pt-2 overflow-scroll h-full pb-15">
        <div ref={contentRef}>
          <Context usedIn={usedIn} />
        </div>
      </div>
    </Panel>
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
