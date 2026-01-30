"use client";

import "@xyflow/react/dist/style.css";

import { useModal } from "@/components/Modal";
import { getRecipeByName } from "@/utils/getRecipeByName";
import { X } from "lucide-react";

export default function Content({ materialName }: { materialName: string }) {
  const { dismiss } = useModal();

  const materialRecipe = getRecipeByName(materialName);
  console.log("materialRecipe:", materialName, materialRecipe);

  return (
    <>
      <div className="flex flex-row justify-between bg-neutral-800 w-full px-8 py-4">
        <h2 className="text-2xl font-bold first-letter:uppercase text-white">
          {materialRecipe ? materialRecipe.name : materialName}
        </h2>
        <button onClick={dismiss} className="text-white">
          <X />
        </button>
      </div>

      <div></div>
    </>
  );
}
