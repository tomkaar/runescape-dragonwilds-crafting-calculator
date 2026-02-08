import { ListTree, Package, Wrench, BookOpen, Info } from "lucide-react";

export const ITEM_PANEL_CONFIGS = {
  materials: {
    id: "materials",
    icon: ListTree,
    defaultSize: undefined,
    minSize: 52,
  },
  selectedMaterials: {
    id: "selected-materials",
    icon: Package,
    defaultSize: undefined,
    minSize: 68,
  },
  usedIn: {
    id: "used-in",
    icon: Wrench,
    defaultSize: undefined,
    minSize: 52,
  },
  allMaterials: {
    id: "all-materials",
    icon: Package,
    defaultSize: undefined,
    minSize: 52,
  },
  selectedRecipes: {
    id: "selected-recipes",
    icon: BookOpen,
    defaultSize: undefined,
    minSize: 52,
  },
  craftingTree: {
    id: "crafting-tree",
    icon: ListTree,
    defaultSize: 52,
    minSize: 52,
  },
  attribution: {
    id: "attribution",
    icon: Info,
    defaultSize: 52,
    minSize: 52,
  },
} as const;
