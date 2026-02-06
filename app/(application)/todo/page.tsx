"use client";
import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { TodoRecipeCard } from "@/components/TodoPage/RecipeCard";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";
import { useTodoCheckedItems } from "@/store/todo-checked-items";
import { Button } from "@/components/ui/button";

export default function TodoPage() {
  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const checkedItems = useTodoCheckedItems((state) => state.items);
  const clearitems = useTodoCheckedItems((state) => state.clear);
  const recipes = Object.entries(rawRecipes).filter(
    ([, value]) => Object.keys(value).length > 0,
  );
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

  const totalUniqueMaterialsWithQuantity = recipes.reduce<
    Record<string, number>
  >((acc, cur) => {
    const [itemId, materials] = cur;

    materials.forEach((mat) => {
      const materialId = mat.itemId;
      const baseQuantity = mat.quantity;
      const materialMultiplier = multiplier[itemId] || 1;
      const totalQuantity = baseQuantity * materialMultiplier;

      if (acc[materialId]) {
        acc[materialId] += totalQuantity;
      } else {
        acc[materialId] = totalQuantity;
      }
    });
    return acc;
  }, {});

  const totalCountOfMaterials = Object.values(
    totalUniqueMaterialsWithQuantity,
  ).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="h-full w-120 p-4 pr-2">
        <div className="h-full bg-neutral-900 rounded-lg px-4 mb-4 overflow-scroll">
          <div className="mb-6 sticky top-0 bg-neutral-900 py-4">
            <h2 className="text-lg font-semibold">
              Selected recipes ({recipes.length})
            </h2>
            <p className="text-sm text-neutral-200 max-w-80">
              When you select a material in a recipe, the recipe will be added
              to this list.
            </p>
          </div>

          <div className="flex flex-col gap-4">
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

      <div className="h-full w-120 p-4 pl-2">
        <div className="h-full bg-neutral-900 rounded-lg px-4 mb-4 overflow-scroll">
          <div className="mb-6 sticky top-0 bg-neutral-900 py-4 flex flex-row gap-2">
            <div className="grow">
              <h2 className="text-lg font-semibold">
                All materials ({totalCountOfMaterials})
              </h2>
              <p className="text-sm text-neutral-200 max-w-80">
                All materials needed for the selected recipes, with total
                quantities adjusted by multipliers.
              </p>
            </div>
            <div>
              <Button onClick={clearitems} className="cursor-pointer">
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {Object.entries(totalUniqueMaterialsWithQuantity).map(
              ([materialId, totalQuantity]) => {
                const material = getItemById(materialId);
                if (!material) return null;

                return (
                  <div
                    key={materialId + totalQuantity}
                    className="flex flex-row gap-2 items-center"
                  >
                    <CheckboxDescription
                      id={material.id}
                      name={material.name}
                      quantity={totalQuantity}
                      image={material.image}
                      defaultChecked={checkedItems.includes(material?.id || "")}
                    />
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  id: string;
  name: string;
  quantity: number;
  image: string | null;
  defaultChecked: boolean;
};

export function CheckboxDescription(props: Props) {
  const { id, name, quantity, image, defaultChecked } = props;

  const toggleAnItem = useTodoCheckedItems((state) => state.toggleAnItem);

  return (
    <FieldGroup className="w-full">
      <Field
        orientation="horizontal"
        className="flex flex-row gap-2 items-center"
        style={{ alignItems: "center" }}
      >
        <Checkbox
          id={`checkbox-${name}`}
          name={`checkbox-${name}`}
          checked={defaultChecked}
          onCheckedChange={() => toggleAnItem(id)}
        />
        <FieldContent>
          <FieldLabel
            htmlFor={`checkbox-${name}`}
            className="flex flex-row gap-2 items-center"
          >
            {image && (
              <Image
                src={createImageUrlPath(image)}
                width={28}
                height={28}
                alt={name}
              />
            )}
            {name} x {quantity}
          </FieldLabel>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
