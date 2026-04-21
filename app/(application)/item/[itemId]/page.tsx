import { getItemById } from "@/utils/itemById";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { cacheLife } from "next/cache";
import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { Panel } from "@xyflow/react";
import { ItemInfoBox } from "@/components/Items/InfoBox/InfoBox";
import { Accordion } from "@/components/ui/accordion";
import { AccordionAllMaterials } from "../../../../components/Items/AllMaterials/AllMaterials";
import { AccordionCraftingTree } from "../../../../components/Items/CraftingTree/CraftingTree";
import { AccordionMaterials } from "../../../../components/Items/Materials/Materials";
import { AccordionUsedIn } from "../../../../components/Items/UsedIn/UsedIn";
import { ClearSelected } from "../../../../components/CraftingTree/Buttons/ClearSelected";
import { Direction } from "../../../../components/CraftingTree/Buttons/Direction";
import itemJSON from "@/data/items.json";
import { Item } from "@/Types";
import { AccordionAttribution } from "@/components/Items/Attribution/Attribution";

const items = itemJSON.sort((a, b) => a.name.localeCompare(b.name)) as Item[];

type Props = {
  params: Promise<{ itemId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { itemId } = await props.params;
  const item = getItemById(itemId);

  return {
    title: [item?.name, "Dragonwilds Crafting Calculator"]
      .filter((s) => s !== null && s !== undefined)
      .join(" | "),
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const item = getItemById(itemId);

  if (item === undefined) {
    notFound();
  }

  return (
    <main className="lg:h-full flex flex-col">
      <div className="w-full flex flex-col gap-4 lg:hidden px-4 py-4">
        <div className="sticky top-0 bg-neutral-900 border border-accent rounded-lg">
          <ItemInfoBox item={item} itemId={itemId} />
        </div>

        <Accordion
          type="multiple"
          defaultValue={[]}
          className="flex flex-col gap-2 pb-2"
        >
          <AccordionMaterials itemId={itemId} />
          <AccordionUsedIn itemId={itemId} />
          <AccordionAllMaterials />
          <AccordionCraftingTree itemId={itemId} />
          <AccordionAttribution />
        </Accordion>
      </div>

      <div className="lg:h-full w-full hidden lg:block">
        <CraftingTree itemId={itemId} treePaddingLeft={400}>
          <Panel position="top-left" className="flex gap-2 pl-96">
            <ClearSelected itemId={itemId} />
            <Direction />
          </Panel>

          <Panel
            position="top-left"
            className="h-full flex flex-col gap-4 overflow-scroll w-92"
          >
            <div className="sticky top-0 bg-neutral-900 border border-accent rounded-lg">
              <ItemInfoBox item={item} itemId={itemId} />
            </div>

            <div className="overflow-scroll rounded-lg flex flex-col gap-4 pb-8">
              <Accordion
                type="multiple"
                defaultValue={[]}
                className="flex flex-col gap-2 pb-2"
              >
                <AccordionMaterials itemId={itemId} />
                <AccordionUsedIn itemId={itemId} />
                <AccordionAllMaterials />
                <AccordionAttribution />
              </Accordion>
            </div>
          </Panel>
        </CraftingTree>
      </div>
    </main>
  );
}
