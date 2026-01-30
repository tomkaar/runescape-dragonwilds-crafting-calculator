import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";

import Link from "next/link";

type Props = {
  materialName: string;
  quantity: number;
  image: string | undefined;
  usedIn: { recipeName: string; recipeVariant?: string }[];
};

export default function Material(props: Props) {
  const { materialName, quantity, image } = props;

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
    </li>
  );
}
