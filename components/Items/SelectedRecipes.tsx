"use client";

import { BookCopy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  CollapsiblePanelDesktop,
  CollapsiblePanelMobile,
} from "@/components/ui/collapsible-panel";
import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useState } from "react";
import { Item } from "@/Types";

type Props = {
  itemId: string;
  variant?: "desktop" | "mobile";
};

export function SelectedRecipes(props: Props) {
  const { variant = "desktop" } = props;

  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const recipes = Object.entries(rawRecipes)
    .map(([recipeId, value]) => {
      const todoMaterials = value.filter((item) => item.state === "TODO");
      return [recipeId, todoMaterials] as [
        string,
        { itemId: string; quantity: number }[],
      ];
    })
    .filter(([, value]) => Object.keys(value).length > 0);

  const modifiedRecipes = recipes.map(([itemId, materials]) => {
    const item = getItemById(itemId);
    if (!item)
      return {
        item: null,
        materials: [],
      };

    return {
      itemId,
      item,
      materials: materials.map((item) => ({
        material: getItemById(item.itemId),
        quantity: item.quantity,
      })),
    };
  });

  const title = `All selected recipes (${recipes.length})`;

  const PanelComponent =
    variant === "mobile" ? CollapsiblePanelMobile : CollapsiblePanelDesktop;

  return (
    <PanelComponent id="selected-recipes" title={title} icon={BookCopy}>
      <div className="h-full w-full">
        <div className="h-full px-4 mb-4 overflow-scroll">
          <p className="mb-4 text-sm text-neutral-200 max-w-80">
            When you select a material in a recipe, the recipe will be added to
            this list.
          </p>

          <div className="flex flex-col">
            {modifiedRecipes.map(({ item, materials }) => {
              const isMultiplier = multiplier[item?.id || ""] || 1;

              return (
                <TodoRecipeCard
                  key={item?.id + "_" + materials.length}
                  item={item}
                  materials={materials}
                  multiplier={isMultiplier}
                />
              );
            })}
          </div>
        </div>
      </div>
    </PanelComponent>
  );
}

type TodoRecipeCardProps = {
  item: Item | null;
  materials: {
    material: Item | undefined;
    quantity: number;
  }[];
  multiplier: number;
};

export function TodoRecipeCard(props: TodoRecipeCardProps) {
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
              <li key={mat?.material?.id} className="flex flex-row gap-2">
                {mat.material?.image && (
                  <Image
                    src={createImageUrlPath(mat.material.image)}
                    width={22}
                    height={22}
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
