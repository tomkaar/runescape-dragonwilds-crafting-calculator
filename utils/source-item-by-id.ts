import itemsData from "@/data/items.json" with { type: "json" };
import { Item } from "@/Types";
import { cache } from "react";

export const sourceItemById = cache((itemId: string): Item | undefined => {
    const item =  itemsData.find(
        (item) => item.id.toLowerCase() === itemId.toLowerCase(),
    );

    return item;
});
