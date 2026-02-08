import { ListTree, Package, Wrench, BookOpen, Info } from "lucide-react";

export const ITEM_PANEL_CONFIGS = {
  materials: {
    id: "materials",
    icon: ListTree,
    defaultSize: undefined,
  },
  selectedMaterials: {
    id: "selected-materials",
    icon: Package,
    defaultSize: undefined,
  },
  usedIn: {
    id: "used-in",
    icon: Wrench,
    defaultSize: undefined,
  },
  allMaterials: {
    id: "all-materials",
    icon: Package,
    defaultSize: undefined,
  },
  selectedRecipes: {
    id: "selected-recipes",
    icon: BookOpen,
    defaultSize: undefined,
  },
  attribution: {
    id: "attribution",
    icon: Info,
    defaultSize: undefined,
  },
} as const;
