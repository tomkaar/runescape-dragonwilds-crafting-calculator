"use client";

import { ScrollText } from "lucide-react";
import Image from "next/image";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  CollapsiblePanelDesktop,
  CollapsiblePanelMobile,
} from "@/components/ui/collapsible-panel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useTodoCheckedItems } from "@/store/todo-checked-items";
import { cn } from "@/lib/utils";

type Props = {
  itemId: string;
  variant?: "desktop" | "mobile";
};

export function AllMaterials(props: Props) {
  const { variant = "desktop" } = props;

  const checkedItems = useTodoCheckedItems((state) => state.items);
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

  const title = `All materials (${totalCountOfMaterials})`;

  const PanelComponent =
    variant === "mobile" ? CollapsiblePanelMobile : CollapsiblePanelDesktop;

  return (
    <PanelComponent id="all-selected-materials" title={title} icon={ScrollText}>
      <div className="h-full w-full">
        <div className="h-full px-4 mb-4 overflow-scroll">
          <p className="mb-4 text-sm text-neutral-200 max-w-80">
            All materials needed for the selected recipes, with total quantities
            adjusted by multipliers.
          </p>

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
    </PanelComponent>
  );
}

type CheckboxDescriptionProps = {
  id: string;
  name: string;
  quantity: number;
  image: string | null;
  defaultChecked: boolean;
};

export function CheckboxDescription(props: CheckboxDescriptionProps) {
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
          className="group"
        />
        <FieldContent>
          <FieldLabel
            htmlFor={`checkbox-${name}`}
            className={cn(
              "flex flex-row gap-2 items-center",
              defaultChecked ? "opacity-50" : "",
            )}
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
