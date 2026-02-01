import { Hammer } from "lucide-react";
import Image from "next/image";
import { Facility } from "@/Types";

export default function getFacilityIcon(
  facility: (typeof Facility)[number],
  size = 20,
) {
  switch (facility) {
    case "Build Menu":
      return <Hammer size={size} />;
    default:
      break;
  }

  const encodedFilename = facility
    .replace(/ /g, "_")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  const url = `https://dragonwilds.runescape.wiki/images/${encodedFilename}.png`;

  return <Image src={url} alt={facility} width={size} height={size} />;
}
