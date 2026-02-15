"use client";

import { PANEL_LAYOUT_SIDEBAR } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group, Panel } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
};

export function LeftSidebar(props: Props) {
  const { children } = props;
  const { sidebarPanelRef, sidebarGroupRef, isLayoutLoading } =
    useContentContext();

  return (
    <Panel
      id="sidebar"
      panelRef={sidebarPanelRef}
      minSize={350}
      maxSize={600}
      collapsible
      collapsedSize={0}
    >
      <Group
        groupRef={sidebarGroupRef}
        id={PANEL_LAYOUT_SIDEBAR}
        orientation="vertical"
        onLayoutChange={(layout) => {
          if (isLayoutLoading) return;
          localStorage.setItem(
            `react-resizable-panels:${PANEL_LAYOUT_SIDEBAR}`,
            JSON.stringify(layout),
          );
        }}
        className="bg-neutral-950"
      >
        {children}
      </Group>
    </Panel>
  );
}
