"use client";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemFavourites } from "@/components/Items/Favourites";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/SelectedMaterials";
import { Item } from "@/Types";
import { Group, Panel, type Layout } from "react-resizable-panels";

export default function Content({
  itemPageLayout,
  itemPageSidebarLayout,
  layoutCookieID,
  sidebarLayoutCookieID,
  item,
  itemId,
}: {
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  layoutCookieID: string;
  sidebarLayoutCookieID: string;
  item: Item;
  itemId: string;
}) {
  return (
    <Group
      id={layoutCookieID}
      defaultLayout={itemPageLayout}
      onLayoutChange={(layout) => {
        document.cookie = `${layoutCookieID}=${JSON.stringify(layout)}; path=/;`;
      }}
    >
      <Panel id="left" minSize={250} defaultSize={350}>
        <Group
          id={sidebarLayoutCookieID}
          orientation="vertical"
          defaultLayout={itemPageSidebarLayout}
          onLayoutChange={(layout) => {
            document.cookie = `${sidebarLayoutCookieID}=${JSON.stringify(layout)}; path=/;`;
          }}
          className="bg-neutral-950 pl-2"
        >
          <div className="px-2 py-4 border-b border-neutral-800">
            <ItemInfoBox item={item} itemId={itemId} />
          </div>

          <RequiredMaterials itemId={itemId} />
          <GroupPanelSeparator />
          <UsedIn itemId={itemId} />
          <GroupPanelSeparator />
          <ItemFavourites />
        </Group>
      </Panel>

      <GroupPanelSeparator horizontal />

      <Panel id="center" minSize={50}>
        <div className="bg-neutral-900 w-full h-full">
          <CraftingTree itemId={itemId} />
        </div>
      </Panel>

      <GroupPanelSeparator horizontal />

      <Panel id="right" minSize={50} defaultSize={350}>
        <div className="min-w-88 h-full flex flex-col gap-4">
          <div className="p-4 grow">
            <SelectedMaterial itemId={itemId} />
          </div>
        </div>
      </Panel>
    </Group>
  );
}
