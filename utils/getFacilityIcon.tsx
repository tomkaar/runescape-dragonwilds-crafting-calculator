import {
  Amphora,
  Anvil,
  BowArrow,
  BrickWallFire,
  BrushCleaning,
  CakeSlice,
  CookingPot,
  Flame,
  FlameKindling,
  Gem,
  Hammer,
  Microwave,
  PawPrint,
  PencilRuler,
  Scissors,
  Spool,
  Stone,
  WandSparkles,
} from "lucide-react";
import { type FacilityType } from "@/data/facilityTypes";
import Image from "next/image";

export default function getFacilityIcon(facility: FacilityType, size = 20) {
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

  // const size = 20;
  // switch (facility) {
  //   case "Anvil":
  //     return <Anvil size={size} />;
  //   case "Blast Furnace":
  //     return <Microwave size={size} />;
  //   case "Brewing Cauldron":
  //     return <Amphora size={size} />;
  //   case "Build Menu":
  //     return <Hammer size={size} />;
  //   case "Campfire":
  //     return <FlameKindling size={size} />;
  //   case "Cooking Range":
  //     return <CookingPot size={size} />;
  //   case "Crafting Table":
  //     return <PencilRuler size={size} />;
  //   case "Fletching Bench":
  //   case "Fletching Table":
  //     return <BowArrow size={size} />;
  //   case "Furnace":
  //   case "Grill":
  //     return <BrickWallFire size={size} />;
  //   case "Grindstone":
  //     return <Stone size={size} />;
  //   case "Jeweler's Bench":
  //     return <Gem size={size} />;
  //   case "Kiln":
  //     return <Flame size={size} />;
  //   case "Loom":
  //     return <Spool size={size} />;
  //   case "Pottery Wheel":
  //     return <BrushCleaning size={size} />;
  //   case "Rune Altar":
  //     return <WandSparkles size={size} />;
  //   case "Sawmill":
  //     return <Scissors size={size} />;
  //   case "Smithing Anvil":
  //   case "Smithing Forge":
  //     return <Anvil size={size} />;
  //   case "Spinning Wheel":
  //     return <Spool size={size} />;
  //   case "Stonecutter":
  //     return <CakeSlice size={size} />;
  //   case "Tannery":
  //     return <PawPrint size={size} />;
  //   case "Lougrim's Shrine":
  //   default:
  //     return null;
  //     break;
  // }
}
