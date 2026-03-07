import { Hammer } from "lucide-react";
import { Facility } from "@/Types";

export default function getFacilityIcon(
  facility: (typeof Facility)[number],
  size = 20,
) {
  switch (facility) {
    case "Build Menu":
      return <Hammer size={size * 0.7} />;
    default:
      break;
  }

  if (!Facility.includes(facility)) return null;

  const encodedFilename = facility
    .replace(/ /g, "_")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  const url = `https://dragonwilds.runescape.wiki/images/thumb/${encodedFilename}.png/${size}px-${encodedFilename}.png`;

  return <img src={url} alt={facility} width={size} height={size} />;
}
