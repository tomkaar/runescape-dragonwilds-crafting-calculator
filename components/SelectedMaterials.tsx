"use client";

import { createImageUrlPath } from "@/playground/items/utils/image";
import { useSelectedMaterial } from "@/store/selected-material";
import { getItemByNameOrId } from "@/utils/getItemById";
import { X } from "lucide-react";
import Image from "next/image";

type Props = {
  itemId: string;
};

export function SelectedMaterial(props: Props) {
  const { itemId } = props;

  const removeMaterial = useSelectedMaterial((state) => state.removeAnItem);
  const handleRemoveMaterial = (id: string) => {
    removeMaterial(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = i[props.itemId] || [];

  const items = selectedMaterials.map((material) => {
    return {
      id: material.id,
      quantity: material.quantity,
      item: getItemByNameOrId(material.itemId),
    };
  });

  return (
    <div>
      <div>
        <h3 className="text-lg">Selected materials</h3>
        <p className="text-sm">Click on a material to add it to the list</p>

        <div className="mt-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-row gap-2 items-center px-2 py-1 hover:bg-neutral-800 rounded-lg"
            >
              <div className="flex flex-row grow gap-2 items-center">
                {item.item?.image && (
                  <Image
                    src={createImageUrlPath(item.item.image)}
                    alt={item.item.name}
                    width={32}
                    height={32}
                  />
                )}
                <span className="block grow line-clamp-1">
                  <span className="font-bold">{item.quantity}x </span>
                  {item.item?.name}
                </span>
              </div>
              <button
                onClick={() => handleRemoveMaterial(item.id)}
                className="text-rose-800 cursor-pointer hover:text-rose-600"
              >
                <X width={20} height={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
