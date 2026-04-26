"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSelectedMaterial } from "@/store/selected-material";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { Checkbox, CheckboxIndeterminate } from "@/components/ui/checkbox";
import { getItemById } from "@/utils/itemById";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  AllMaterialsDropdownMenu,
  MaterialNavigateMenu,
} from "./AllMaterialsDropdownMenu";

type RecipeEntry = {
  recipeId: string;
  quantity: number;
  multiplier: number;
  nodeId?: string;
};

function MaterialRow({
  materialId,
  recipes,
  totalQuantity,
  checkboxState,
  isRecipeChecked,
  onTotalCheckboxChange,
  onRecipeCheckboxChange,
}: {
  materialId: string;
  recipes: RecipeEntry[];
  totalQuantity: number;
  checkboxState: boolean | "indeterminate";
  isRecipeChecked: (
    materialId: string,
    recipeId: string,
    nodeId?: string,
  ) => boolean;
  onTotalCheckboxChange: (
    prevState: boolean | "indeterminate",
    materialId: string,
    recipeData: { recipeId: string; nodeId?: string }[],
  ) => void;
  onRecipeCheckboxChange: (
    prevChecked: boolean,
    recipeId: string,
    nodeId?: string,
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const material = getItemById(materialId);
  if (!material) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex flex-row gap-2 items-center">
        <CheckboxIndeterminate
          checked={checkboxState}
          onCheckedChange={() =>
            onTotalCheckboxChange(checkboxState, materialId, recipes)
          }
        />
        <CollapsibleTrigger className="flex-1">
          <div className="flex flex-row gap-2 items-center pr-2 pl-2 py-0.5 rounded-lg text-sm group hover:bg-accent w-full justify-start transition-none">
            {material.image && (
              <img
                src={createImageUrlPath(material.image)}
                width={24}
                height={24}
                alt={material.name}
              />
            )}
            <span className="font-semibold text-foreground">
              {totalQuantity}x
            </span>
            <span className="text-left">{material.name}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 self-center ml-auto text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <MaterialNavigateMenu materialId={materialId} />
      </div>

      <div className="pl-2">
        <CollapsibleContent className="border-l border-border pl-2">
          <div className="flex flex-col pl-2">
            {recipes.map((recipe) => {
              const recipeItem = getItemById(recipe.recipeId);
              if (!recipeItem) return null;

              const isChecked = isRecipeChecked(
                materialId,
                recipe.recipeId,
                recipe.nodeId,
              );

              return (
                <div
                  key={recipe.nodeId}
                  className="flex flex-row gap-2 items-center"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      onRecipeCheckboxChange(
                        isChecked,
                        recipe.recipeId,
                        recipe.nodeId,
                      )
                    }
                  />
                  <div className="flex flex-row gap-2 items-center px-2 py-1 rounded-lg text-sm flex-1 justify-start hover:bg-accent">
                    {recipeItem.image && (
                      <img
                        src={createImageUrlPath(recipeItem.image)}
                        width={24}
                        height={24}
                        alt={recipeItem.name}
                      />
                    )}
                    <span className="font-semibold">
                      {recipe.quantity * recipe.multiplier}x
                    </span>
                    <span className="text-left">{recipeItem.name}</span>
                    {recipe.multiplier > 1 && (
                      <span className="text-muted-foreground">
                        ({recipe.multiplier}x)
                      </span>
                    )}
                  </div>
                  {recipe.nodeId && (
                    <AllMaterialsDropdownMenu
                      recipeId={recipe.recipeId}
                      nodeId={recipe.nodeId}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function AllMaterialsContent() {
  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const markAsDoneByNodeId = useSelectedMaterial(
    (state) => state.markAsDoneByNodeId,
  );
  const markAsTodoByNodeId = useSelectedMaterial(
    (state) => state.markAsTodoByNodeId,
  );

  const recipes = Object.entries(rawRecipes)
    .map(([recipeId, value]) => {
      const todoMaterials = value;
      return [recipeId, todoMaterials] as [
        string,
        { itemId: string; quantity: number; nodeId?: string }[],
      ];
    })
    .filter(([, value]) => Object.keys(value).length > 0);

  const materialsByRecipe = recipes.reduce<Record<string, RecipeEntry[]>>(
    (acc, [recipeId, materials]) => {
      materials.forEach((material) => {
        const materialId = material.itemId;
        if (!acc[materialId]) {
          acc[materialId] = [];
        }
        acc[materialId].push({
          recipeId,
          quantity: material.quantity,
          multiplier: multiplier[recipeId] || 1,
          nodeId: material.nodeId,
        });
      });
      return acc;
    },
    {},
  );

  const isRecipeChecked = (
    materialId: string,
    recipeId: string,
    nodeId?: string,
  ) => {
    const recipeItems = rawRecipes[recipeId] || [];
    const item = nodeId
      ? recipeItems.find((i) => i.itemId === materialId && i.nodeId === nodeId)
      : recipeItems.find((i) => i.itemId === materialId);
    return item ? item.state === "DONE" : false;
  };

  const getMaterialState = (
    materialId: string,
    recipeEntries: { recipeId: string; nodeId?: string }[],
  ): boolean | "indeterminate" => {
    const states = recipeEntries.map(({ recipeId, nodeId }) =>
      isRecipeChecked(materialId, recipeId, nodeId),
    );
    const allChecked = states.every((s) => s === true);
    const noneChecked = states.every((s) => s === false);

    if (allChecked) return true;
    if (noneChecked) return false;
    return "indeterminate";
  };

  const handleTotalCheckboxChange = (
    prevState: boolean | "indeterminate",
    materialId: string,
    recipeData: { recipeId: string; nodeId?: string }[],
  ) => {
    const shouldSetAsDone = prevState !== true;

    recipeData.forEach((recipe) => {
      if (!recipe.nodeId) return;
      if (shouldSetAsDone) {
        markAsDoneByNodeId(recipe.recipeId, recipe.nodeId);
      } else if (isRecipeChecked(materialId, recipe.recipeId)) {
        markAsTodoByNodeId(recipe.recipeId, recipe.nodeId);
      }
    });
  };

  const handleRecipeCheckboxChange = (
    prevChecked: boolean,
    recipeId: string,
    nodeId?: string,
  ) => {
    if (!nodeId) return;
    if (prevChecked) {
      markAsTodoByNodeId(recipeId, nodeId);
    } else {
      markAsDoneByNodeId(recipeId, nodeId);
    }
  };

  const totalUniqueMaterialsWithQuantity = recipes.reduce<
    Record<string, number>
  >((acc, [itemId, materials]) => {
    materials.forEach((mat) => {
      const materialId = mat.itemId;
      const totalQuantity = mat.quantity * (multiplier[itemId] || 1);
      acc[materialId] = (acc[materialId] || 0) + totalQuantity;
    });
    return acc;
  }, {});

  return (
    <div className="w-full">
      <div className="space-y-1">
        {Object.entries(materialsByRecipe).map(([materialId, matRecipes]) => (
          <MaterialRow
            key={materialId}
            materialId={materialId}
            recipes={matRecipes}
            totalQuantity={totalUniqueMaterialsWithQuantity[materialId] || 0}
            checkboxState={getMaterialState(materialId, matRecipes)}
            isRecipeChecked={isRecipeChecked}
            onTotalCheckboxChange={handleTotalCheckboxChange}
            onRecipeCheckboxChange={handleRecipeCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
}
