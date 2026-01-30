"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

import { CircleQuestionMark, Trash } from "lucide-react";
import { useSelectedItems } from "@/store/selected-items";

import recipes from "@/data/recipes.json" assert { type: "json" };
import { GroupedRecipes } from "@/data/recipes";
import Image from "next/image";
import Recipe from "./Recipe";
import Link from "next/link";

type Props = {
  id: string;
  itemId: string;
  variantCounts: Record<string, number>;
};

export default function RecipeCard(props: Props) {
  const { id, itemId } = props;
  const recipe = (recipes as unknown as GroupedRecipes)[itemId];

  const removeAnItem = useSelectedItems((state) => state.removeAnItem);

  if (!recipe) {
    return null;
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <div className="flex flex-row items-center gap-2 py-2">
          {recipe.image ? (
            <Image
              src={recipe.image}
              width={36}
              height={36}
              alt={recipe.name}
            />
          ) : null}
          <div className="grow flex flex-row items-center">
            <span>{recipe.name}</span>
            <Link
              href={{ pathname: "/item/" + itemId }}
              className="ml-2 text-white"
            >
              <CircleQuestionMark size={16} />
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAnItem(id)}
          >
            <Trash />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="">
          {recipe.recipes.map((r, idx) => (
            <Recipe
              key={r.id}
              index={idx}
              recipe={r}
              id={id}
              variantCounts={props.variantCounts}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
