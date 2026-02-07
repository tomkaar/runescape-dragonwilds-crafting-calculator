"use client";

import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef, type ReactNode, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";

type BaseCollapsiblePanelProps = {
  id: string;
  title: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  children: ReactNode;
  defaultSize?: number;
  className?: string;
};

export function CollapsiblePanelDesktop({
  id,
  title,
  icon: Icon,
  actions,
  children,
  className,
  defaultSize,
}: BaseCollapsiblePanelProps) {
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.resize(
          contentHeight ? contentHeight + 52 + 20 : "50%",
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
      minSize={52}
      collapsible
      collapsedSize={52}
      defaultSize={defaultSize}
      className={cn("bg-neutral-950 rounded-lg", className)}
    >
      <div className="flex flex-row gap-2 items-center px-4">
        <button
          onClick={togglePanel}
          className="cursor-pointer w-full flex flex-row items-center gap-2 py-4 text-sm"
        >
          {Icon && <Icon className="w-4 h-4 text-neutral-600" />}
          {title}
        </button>
        {actions}
      </div>

      <div className="overflow-scroll h-full pb-15">
        <div ref={contentRef} className="flex flex-col gap-1 w-full">
          {children}
        </div>
      </div>
    </Panel>
  );
}

export function CollapsiblePanelMobile({
  title,
  icon: Icon,
  actions,
  children,
  className,
}: BaseCollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn("bg-neutral-950 border-t border-neutral-800", className)}
    >
      <div className="flex flex-row gap-2 items-center px-4">
        <button
          onClick={togglePanel}
          className="cursor-pointer w-full flex flex-row items-center gap-2 py-4 text-sm"
        >
          {Icon && (
            <Icon className="w-4 h-4 text-neutral-600 fill-neutral-600" />
          )}
          {title}
        </button>
        {actions}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="pt-2 overflow-scroll pb-4">
          <div ref={contentRef} className="flex flex-col gap-1 w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
