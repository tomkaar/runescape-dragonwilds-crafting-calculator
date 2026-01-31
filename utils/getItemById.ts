import itemsData from "@/data/items.json" assert { type: "json" };

export function getItemByNameOrId(materialName: string) {
  return itemsData.find(
    (item) => item.id.toLowerCase() === materialName.toLowerCase(),
  );
}
