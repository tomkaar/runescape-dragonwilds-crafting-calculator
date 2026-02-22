import Link from "next/link";
import { Item } from "@/Types";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import { BookSearch, ChevronRight } from "lucide-react";

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

  return (
    <div className="overflow-hidden">
      <div className="flex flex-row items-center">
        <Link
          href={{ pathname: `/item/${item?.id}` }}
          className="flex flex-row gap-2 items-center text-xs whitespace-nowrap p-2"
        >
          <div className="text-base">
            <div className="flex flex-row gap-2 items-center">
              {item?.name} ({materials.length})
              <BookSearch size={16} />
            </div>
            {multiplier > 1 && (
              <div className="text-xs text-title -mt-0.5">
                Multiplier: x{multiplier}
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="pl-4 pb-1">
        <ul className="">
          {materials.map((mat) => (
            <li
              key={mat?.material?.id}
              className="flex flex-row items-center gap-2"
            >
              {mat.material?.image && (
                <img
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
    </div>
  );
}
