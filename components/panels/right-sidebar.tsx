"use client";

import { PANEL_LAYOUT_SIDEBAR_RIGHT } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group, Panel } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
};

export function RightSidebar(props: Props) {
  const { children } = props;
  const { sidebarRightPanelRef, rightSidebarGroupRef, isLayoutLoading } =
    useContentContext();

  return (
    <Panel
      id="sidebar-right"
      panelRef={sidebarRightPanelRef}
      collapsible
      collapsedSize={0}
      minSize={350}
      maxSize={600}
      className="bg-background"
    >
      <Group
        groupRef={rightSidebarGroupRef}
        id={PANEL_LAYOUT_SIDEBAR_RIGHT}
        orientation="vertical"
        onLayoutChange={(layout) => {
          if (isLayoutLoading) return;
          localStorage.setItem(
            `react-resizable-panels:${PANEL_LAYOUT_SIDEBAR_RIGHT}`,
            JSON.stringify(layout),
          );
        }}
        className="bg-background"
      >
        {children}
      </Group>
    </Panel>
  );
}
