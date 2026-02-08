"use client";

import { PANEL_LAYOUT_SIDEBAR } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group, type Layout, Panel } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
  layout: Layout | undefined;
};

export function LeftSidebar(props: Props) {
  const { children, layout } = props;
  const { sidebarPanelRef } = useContentContext();

  return (
    <Panel
      id="sidebar"
      panelRef={sidebarPanelRef}
      minSize={350}
      defaultSize={350}
      collapsible
      collapsedSize={0}
    >
      <Group
        id={PANEL_LAYOUT_SIDEBAR}
        orientation="vertical"
        defaultLayout={layout}
        onLayoutChange={(layout) => {
          document.cookie = `${PANEL_LAYOUT_SIDEBAR}=${JSON.stringify(layout)}; path=/;`;
        }}
        className="bg-neutral-950"
      >
        {children}
      </Group>
    </Panel>
  );
}
