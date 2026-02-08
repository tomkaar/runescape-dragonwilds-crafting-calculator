"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Item } from "@/Types";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

type TodoRecipeCardProps = {
  item: Item | null;
  materials: {
    material: Item | undefined;
    quantity: number;
  }[];
  multiplier: number;
};

export function Card(props: TodoRecipeCardProps) {
  const { item, materials, multiplier } = props;

  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden">
      <div className="flex flex-row items-center gap-4">
        <button
          className="grow text-left cursor-pointer px-4 py-0 flex flex-row items-center gap-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="text-sm">
            {item?.name} ({materials.length})
            {multiplier > 1 && (
              <div className="text-xs text-yellow-400 -mt-0.5">
                Multiplier: x{multiplier}
              </div>
            )}
          </div>
        </button>
        <div>
          <Link
            href={{ pathname: `/item/${item?.id}` }}
            className="flex flex-row gap-2 items-center text-xs whitespace-nowrap p-2"
          >
            Recipe
          </Link>
        </div>
      </div>

      {open && (
        <div className="pl-8 pr-4 py-2">
          <ul className="">
            {materials.map((mat) => (
              <li
                key={mat?.material?.id}
                className="flex flex-row items-center gap-2"
              >
                {mat.material?.image && (
                  <Image
                    src={createImageUrlPath(mat.material.image)}
                    width={28}
                    height={28}
                    alt={mat.material.name}
                  />
                )}
                <span className="text-sm">
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
