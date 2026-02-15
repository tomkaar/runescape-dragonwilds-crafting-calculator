"use client";

import { PANEL_LAYOUT_PAGE } from "@/constants/panel-layout";
import { type ReactNode } from "react";
import { Group } from "react-resizable-panels";
import { useContentContext } from "./context";

type Props = {
  children: ReactNode;
};

export function PageLayout(props: Props) {
  const { children } = props;

  const {
    setRightSidebarIsCollapsed,
    setSidebarIsCollapsed,
    isLayoutLoading,
    pageGroupRef,
  } = useContentContext();

  return (
    <div className="relative h-full">
      <Group
        groupRef={pageGroupRef}
        id={PANEL_LAYOUT_PAGE}
        onLayoutChange={(layout) => {
          if (isLayoutLoading) return;
          setSidebarIsCollapsed(layout.sidebar === 0);
          setRightSidebarIsCollapsed(layout["sidebar-right"] === 0);
          localStorage.setItem(
            `react-resizable-panels:${PANEL_LAYOUT_PAGE}`,
            JSON.stringify(layout),
          );
        }}
      >
        {children}
      </Group>

      {isLayoutLoading && (
        <div className="absolute inset-0 z-20 animate-pulse bg-neutral-950" />
      )}
    </div>
  );
}
