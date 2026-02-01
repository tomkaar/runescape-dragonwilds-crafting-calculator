"use client";

import { Hammer } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSettings } from "@/store/settings";
import { getUsedIn } from "@/utils/getUsedIn";
import Link from "next/link";
import Image from "next/image";
import { createImageUrlPath } from "@/playground/items/utils/image";

type Props = {
  itemId: string;
};

export function UsedIn(props: Props) {
  const isOpen = useSettings((state) => state.UIItemUsedInOpen);
  const toggle = useSettings((state) => state.toggleUIItemUsedInOpen);

  const usedIn = getUsedIn(props.itemId);

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? "item-1" : ""}
      onValueChange={toggle}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-4 cursor-pointer">
          <div className="flex flex-row items-center gap-2">
            <Hammer className="w-4 h-4 text-neutral-600 fill-neutral-600" />
            Used In ({usedIn.length})
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 max-h-80 overflow-y-auto">
          <Context usedIn={usedIn} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

type ContentProps = {
  usedIn: { id: string; name: string; image: string | null }[];
};

function Context(props: ContentProps) {
  const { usedIn } = props;

  return (
    <ul className="flex flex-col gap-2 flex-wrap">
      {usedIn.length === 0 && (
        <li className="text-sm text-neutral-500">Not used in any recipes</li>
      )}
      {usedIn
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => (
          <li key={item.id}>
            <Link
              href={{ pathname: `/item/${item.id}` }}
              className="bg-neutral-800 rounded-lg px-3 py-1 flex flex-row gap-1 items-center"
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
