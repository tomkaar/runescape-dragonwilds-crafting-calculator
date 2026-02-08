"use client";

import { PANEL_LAYOUT_SIDEBAR_RIGHT } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group, type Layout, Panel } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
  layout: Layout | undefined;
};

export function RightSidebar(props: Props) {
  const { children, layout } = props;
  const { sidebarRightPanelRef } = useContentContext();

  return (
    <Panel
      id="sidebar-right"
      panelRef={sidebarRightPanelRef}
      collapsible
      collapsedSize={0}
      minSize={350}
      defaultSize={350}
      className="bg-neutral-950"
    >
      <Group
        id={PANEL_LAYOUT_SIDEBAR_RIGHT}
        orientation="vertical"
        defaultLayout={layout}
        onLayoutChange={(layout) => {
          document.cookie = `${PANEL_LAYOUT_SIDEBAR_RIGHT}=${JSON.stringify(layout)}; path=/;`;
        }}
        className="bg-neutral-950"
      >
        {children}
      </Group>
    </Panel>
  );
}
