"use client";

import { useSelectedMaterial } from "@/store/selected-material";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { Checkbox, CheckboxIndeterminate } from "@/components/ui/checkbox";
import { getItemById } from "@/utils/itemById";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

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

  const materialsByRecipe = recipes.reduce<
    Record<
      string,
      {
        recipeId: string;
        quantity: number;
        multiplier: number;
        nodeId?: string;
      }[]
    >
  >((acc, [recipeId, materials]) => {
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
  }, {});

  // Helper function to check if a material-recipe combination is checked (DONE)
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

  // Helper function to get the state of all recipes for a material
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
    recipeData: {
      recipeId: string;
      nodeId?: string;
    }[],
  ) => {
    const shouldSetAsDone = prevState === true ? false : true;

    // Toggle all recipes for this material
    recipeData.forEach((recipe) => {
      if (!recipe.nodeId) return;
      // Mark as DONE
      if (shouldSetAsDone) {
        markAsDoneByNodeId(recipe.recipeId, recipe.nodeId);
      }
      // Mark as TODO
      else if (isRecipeChecked(materialId, recipe.recipeId)) {
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
      markAsDoneByNodeId(recipeId, nodeId!);
    }
  };

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

  return (
    <div className="w-full">
      <div className="space-y-4">
        {Object.entries(materialsByRecipe).map(([materialId, recipes]) => {
          const material = getItemById(materialId);
          if (!material) return null;

          const totalQuantity =
            totalUniqueMaterialsWithQuantity[materialId] || 0;
          const checkboxState = getMaterialState(materialId, recipes);

          return (
            <div key={materialId} className="space-y-2">
              {/* Total Checkbox */}
              <div className="flex flex-row gap-2 items-center">
                <CheckboxIndeterminate
                  checked={checkboxState}
                  onCheckedChange={() =>
                    handleTotalCheckboxChange(
                      checkboxState,
                      materialId,
                      recipes,
                    )
                  }
                />
                <div className="flex flex-row gap-1 items-center text-sm">
                  {material.image && (
                    <img
                      src={createImageUrlPath(material.image)}
                      width={24}
                      height={24}
                      alt={material.name}
                    />
                  )}
                  <span>
                    <span className="font-semibold">{totalQuantity}x</span>{" "}
                    {material.name}
                  </span>
                </div>
              </div>

              {/* Recipe Checkboxes */}
              <div className="ml-6 space-y-1">
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
                      className="flex flex-row gap-2 items-center text-sm"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleRecipeCheckboxChange(
                            isChecked,
                            recipe.recipeId,
                            recipe.nodeId,
                          )
                        }
                      />
                      <div className="flex flex-row gap-2 items-center">
                        <span className="font-semibold">
                          {recipe.quantity * recipe.multiplier}x
                        </span>{" "}
                        <span className="inline-flex text-neutral-400">
                          (
                          {recipeItem.image && (
                            <img
                              src={createImageUrlPath(recipeItem.image)}
                              width={20}
                              height={20}
                              alt={recipeItem.name}
                              className="mr-0.5"
                            />
                          )}
                          {recipe.multiplier}x {recipeItem.name})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
