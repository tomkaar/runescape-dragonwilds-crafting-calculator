"use client";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";
import { GroupPanelSeparator } from "@/components/GroupPanelSeparator";
import { ItemInfoBox } from "@/components/Items/InfoBox";
import { RequiredMaterials } from "@/components/Items/RequiredMaterials";
import { UsedIn } from "@/components/Items/UsedIn";
import { SelectedMaterial } from "@/components/Items/SelectedMaterials/SelectedMaterials";
import { Item } from "@/Types";
import { Group, Panel, usePanelRef, type Layout } from "react-resizable-panels";
import { Attribution } from "@/components/Items/Attribution";
import { Suspense, useState } from "react";
import { SelectedRecipes } from "@/components/Items/SelectedRecipes";
import { AllMaterials } from "@/components/Items/AllMaterials";
import {
  PANEL_LAYOUT_PAGE,
  PANEL_LAYOUT_SIDEBAR,
  PANEL_LAYOUT_SIDEBAR_RIGHT,
} from "@/constants/panel-layout";

export default function ContentDesktop({
  itemPageLayout,
  itemPageSidebarLayout,
  itemPageSidebarRightLayout,
  item,
  itemId,
}: {
  itemPageLayout: Layout | undefined;
  itemPageSidebarLayout: Layout | undefined;
  itemPageSidebarRightLayout: Layout | undefined;
  item: Item;
  itemId: string;
}) {
  const sidebarRef = usePanelRef();
  const sidebarRightRef = usePanelRef();

  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(false);
  const [rightSidebarIsCollapsed, setRightSidebarIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      if (sidebarRef.current.isCollapsed()) {
        sidebarRef.current.expand();
      } else {
        sidebarRef.current.collapse();
      }
    }
  };

  const toggleRightSidebar = () => {
    if (sidebarRightRef.current) {
      if (sidebarRightRef.current.isCollapsed()) {
        sidebarRightRef.current.expand();
      } else {
        sidebarRightRef.current.collapse();
      }
    }
  };

  return (
    <Group
      id={PANEL_LAYOUT_PAGE}
      defaultLayout={itemPageLayout}
      onLayoutChange={(layout) => {
        setSidebarIsCollapsed(layout.sidebar === 0);
        setRightSidebarIsCollapsed(layout["sidebar-right"] === 0);
        document.cookie = `${PANEL_LAYOUT_PAGE}=${JSON.stringify(layout)}; path=/;`;
      }}
    >
      <Panel
        id="sidebar"
        panelRef={sidebarRef}
        minSize={350}
        defaultSize={350}
        collapsible
        collapsedSize={0}
      >
        <Group
          id={PANEL_LAYOUT_SIDEBAR}
          orientation="vertical"
          defaultLayout={itemPageSidebarLayout}
          onLayoutChange={(layout) => {
            document.cookie = `${PANEL_LAYOUT_SIDEBAR}=${JSON.stringify(layout)}; path=/;`;
          }}
          className="bg-neutral-950"
        >
          <ItemInfoBox item={item} itemId={itemId} />
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

      <Panel id="center" minSize={150}>
        <Suspense>
          <div className="bg-neutral-900 w-full h-full">
            <CraftingTree
              itemId={itemId}
              sidebarIsCollapsed={sidebarIsCollapsed}
              rightSidebarIsCollapsed={rightSidebarIsCollapsed}
              toggleSidebar={toggleSidebar}
              toggleRightSidebar={toggleRightSidebar}
            />
          </div>
        </Suspense>
      </Panel>

      <GroupPanelSeparator horizontal />

      <Panel
        id="sidebar-right"
        panelRef={sidebarRightRef}
        collapsible
        collapsedSize={0}
        minSize={350}
        defaultSize={350}
        className="bg-neutral-950"
      >
        <Group
          id={PANEL_LAYOUT_SIDEBAR_RIGHT}
          orientation="vertical"
          defaultLayout={itemPageSidebarRightLayout}
          onLayoutChange={(layout) => {
            document.cookie = `${PANEL_LAYOUT_SIDEBAR_RIGHT}=${JSON.stringify(layout)}; path=/;`;
          }}
          className="bg-neutral-950"
        >
          <AllMaterials itemId={itemId} variant="desktop" />
          <GroupPanelSeparator />
          <SelectedRecipes itemId={itemId} variant="desktop" />
        </Group>
      </Panel>
    </Group>
  );
}
