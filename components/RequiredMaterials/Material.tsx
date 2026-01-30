import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";

import Link from "next/link";
import { getRecipeByName } from "@/utils/getRecipeByName";

type Props = {
  materialName: string;
  quantity: number;
  image: string | undefined;
  usedIn: { recipeName: string; recipeVariant?: string }[];
};

export default function Material(props: Props) {
  const { materialName, quantity, image, usedIn } = props;

  const materialRecipe = getRecipeByName(materialName);

  return (
    <li key={materialName} className="flex flex-row gap-2">
      {image && (
        <Image
          src={image}
          alt={materialName}
          width={30}
          height={30}
          className="object-contain"
        />
      )}
      <span>
        <span className="font-bold">{quantity}x</span> {materialName}
      </span>

      <Link
        href={{ pathname: "/item/" + materialName }}
        className="ml-auto text-white"
      >
        <CircleQuestionMark size={16} />
      </Link>

      {/* <button
        popoverTarget={`mypopover-${materialName}`}
        className={`anchor-${materialName}`}
        style={{ anchorName: `anchor-${materialName}` }}
      >
        <CircleQuestionMark size={16} />
      </button> */}

      {/* <div
        id={`mypopover-${materialName}`}
        popover="auto"
        className="p-4 rounded-lg bg-neutral-700 max-w-xs shadow-2xl shadow-black"
        style={{
          position: "absolute",
          positionAnchor: `anchor-${materialName}`,
          top: "anchor(bottom)",
          justifySelf: "anchor-center",
          margin: "10px",
        }}
      >
        <div className="text-white text-sm space-y-3">

          <div>
            <div className="text-xs text-gray-white mb-1">Used in:</div>
            <ul className="list-disc pl-4 space-y-1">
              {usedIn.map((source, idx) => (
                <li key={idx} className="ml-2">
                  {source.recipeName}
                  {source.recipeVariant && ` (${source.recipeVariant})`}
                </li>
              ))}
            </ul>
          </div>

          {materialRecipe?.recipes && materialRecipe?.recipes.length > 0 ? (
            <div>
              <div className="text-xs text-gray-white mb-1">Crafted at:</div>

              <ul className="list-disc pl-4 space-y-1">
                {materialRecipe.recipes.map((recipe, idx, arr) => (
                  <li key={idx} className="ml-2">
                    {arr.length > 1 && "Option " + (idx + 1) + ": "}
                    {recipe.facility || "None"}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div> */}
    </li>
  );
}
