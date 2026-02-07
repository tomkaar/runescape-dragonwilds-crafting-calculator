"use client";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/Items/SelectedMaterials/SelectedMaterials";
import { Item } from "@/Types";
import { Group, Panel, type Layout } from "react-resizable-panels";
import { Attribution } from "@/components/Items/Attribution";

export default function ContentDesktop({
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
      <Panel id="left" minSize={350} defaultSize={350}>
        <Group
          id={sidebarLayoutCookieID}
          orientation="vertical"
          defaultLayout={itemPageSidebarLayout}
          onLayoutChange={(layout) => {
            document.cookie = `${sidebarLayoutCookieID}=${JSON.stringify(layout)}; path=/;`;
          }}
          className="bg-neutral-950"
        >
          <div className="px-2 py-4 border-b border-neutral-800">
            <ItemInfoBox item={item} itemId={itemId} />
          </div>

          <RequiredMaterials itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <SelectedMaterial itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <UsedIn itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <Attribution variant="desktop" />
        </Group>
      </Panel>

      <GroupPanelSeparator horizontal />

      <Panel id="center" minSize={50}>
        <div className="bg-neutral-900 w-full h-full">
          <CraftingTree itemId={itemId} />
        </div>
      </Panel>
    </Group>
  );
}
