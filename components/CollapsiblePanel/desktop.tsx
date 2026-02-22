"use client";

import { Panel, usePanelRef } from "react-resizable-panels";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContextValue = {
  togglePanel: () => void;
};

const CollapsiblePanelDesktopContext = createContext<ContextValue | null>(null);

function useCollapsiblePanelDesktop() {
  const context = useContext(CollapsiblePanelDesktopContext);
  if (!context) {
    throw new Error(
      "CollapsiblePanel.Desktop components must be used within CollapsiblePanel.Desktop",
    );
  }
  return context;
}

type CollapsiblePanelDesktopButtonLayoutProps = {
  children: ReactNode;
};

export function CollapsiblePanelDesktopButtonLayout({
  children,
}: CollapsiblePanelDesktopButtonLayoutProps) {
  return (
    <div className="flex flex-row gap-2 items-center px-4 bg-card">
      {children}
    </div>
  );
}

type CollapsiblePanelDesktopButtonTriggerProps = {
  children: ReactNode;
};

export function CollapsiblePanelDesktopButtonTrigger({
  children,
}: CollapsiblePanelDesktopButtonTriggerProps) {
  // const { togglePanel } = useCollapsiblePanelDesktop();

  return (
    <div className="w-full flex flex-row items-center gap-2 py-4 text-base font-bold">
      {children}
    </div>
  );
  // return (
  //   <button
  //     onClick={togglePanel}
  //     className="cursor-pointer w-full flex flex-row items-center gap-2 py-4 text-base font-bold"
  //   >
  //     {children}
  //   </button>
  // );
}

type CollapsiblePanelDesktopContentProps = {
  children: ReactNode;
};

export function CollapsiblePanelDesktopContent({
  children,
}: CollapsiblePanelDesktopContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-scroll h-full pb-15 pt-4">
      <div ref={contentRef} className="flex flex-col gap-1 w-full">
        {children}
      </div>
    </div>
  );
}

type CollapsiblePanelDesktopProps = {
  id: string;
  children: ReactNode;
  defaultSize?: number;
  className?: string;
  minSize: number;
};

export function CollapsiblePanelDesktopRoot({
  id,
  children,
  className,
  defaultSize,
  minSize,
}: CollapsiblePanelDesktopProps) {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.resize(
          contentHeight ? contentHeight + minSize + 20 : "50%",
        );
      } else {
        panelRef.current.collapse();
      }
    }
  };

  return (
    <Panel
      id={id}
      panelRef={panelRef}
      minSize={minSize}
      collapsible
      collapsedSize={minSize}
      defaultSize={defaultSize}
      className={cn("bg-background rounded-lg", className)}
    >
      <CollapsiblePanelDesktopContext.Provider value={{ togglePanel }}>
        <div ref={contentRef} className="h-full">
          {children}
        </div>
      </CollapsiblePanelDesktopContext.Provider>
    </Panel>
  );
}
