"use client";

import { PANEL_LAYOUT_PAGE } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group, type Layout } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
  layout: Layout | undefined;
};

export function PageLayout(props: Props) {
  const { children, layout } = props;

  const { setRightSidebarIsCollapsed, setSidebarIsCollapsed } =
    useContentContext();

  return (
    <Group
      id={PANEL_LAYOUT_PAGE}
      defaultLayout={layout}
      onLayoutChange={(layout) => {
        setSidebarIsCollapsed(layout.sidebar === 0);
        setRightSidebarIsCollapsed(layout["sidebar-right"] === 0);
        document.cookie = `${PANEL_LAYOUT_PAGE}=${JSON.stringify(layout)}; path=/;`;
      }}
    >
      {children}
    </Group>
  );
}
