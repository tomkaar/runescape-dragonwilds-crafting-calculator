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

  // Handle special case for Fletching Table
  if (facility === "Fletching Table") {
    facility = "Fletching Bench";
  }

  const encodedFilename = facility
    .replace(/ /g, "_")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  const url = `https://dragonwilds.runescape.wiki/images/${encodedFilename}.png`;

  return <img src={url} alt={facility} width={size} height={size} />;
}
