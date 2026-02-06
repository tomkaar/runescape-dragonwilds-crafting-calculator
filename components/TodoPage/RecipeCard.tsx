"use client";

import Image from "next/image";
import Link from "next/link";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

import { Item } from "@/Types";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  item: Item | null;
  materials: {
    material: Item | undefined;
    quantity: number;
  }[];
  multiplier: number;
};

export function TodoRecipeCard(props: Props) {
  const { item, materials, multiplier } = props;

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-neutral-800 hover:bg-neutral-700 overflow-hidden rounded-lg border border-neutral-800  ">
      <div className="flex flex-row items-center gap-4">
        <button
          className="grow text-left cursor-pointer px-4 py-1 flex flex-row items-center gap-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          <div>
            {item?.name} ({materials.length})
            {multiplier > 1 && (
              <div className="text-sm text-yellow-400 -mt-0.5">
                Multiplier: x{multiplier}
              </div>
            )}
          </div>
        </button>
        <div>
          <Link
            href={{ pathname: `/item/${item?.id}` }}
            className="flex flex-row gap-2 items-center text-sm whitespace-nowrap p-4"
          >
            See recipe
          </Link>
        </div>
      </div>

      {open && (
        <div className="p-4 bg-neutral-900">
          <ul className="">
            {materials.map((mat) => (
              <li key={mat?.material?.id} className="flex flex-row gap-2">
                {mat.material?.image && (
                  <Image
                    src={createImageUrlPath(mat.material.image)}
                    width={28}
                    height={28}
                    alt={mat.material.name}
                  />
                )}
                <span>
                  <span className="font-semibold">
                    {mat?.quantity * multiplier}x{" "}
                  </span>
                  {mat?.material?.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
