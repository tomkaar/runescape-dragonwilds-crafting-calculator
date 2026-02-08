"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type ContextValue = {
  togglePanel: () => void;
  isOpen: boolean;
};

const CollapsiblePanelMobileContext = createContext<ContextValue | null>(null);

function useCollapsiblePanelMobile() {
  const context = useContext(CollapsiblePanelMobileContext);
  if (!context) {
    throw new Error(
      "CollapsiblePanel.Mobile components must be used within CollapsiblePanel.Mobile",
    );
  }
  return context;
}

type CollapsiblePanelMobileButtonLayoutProps = {
  children: ReactNode;
};
export function CollapsiblePanelMobileButtonLayout({
  children,
}: CollapsiblePanelMobileButtonLayoutProps) {
  return (
    <div className="flex flex-row gap-2 items-center px-4">{children}</div>
  );
}

type CollapsiblePanelMobileButtonTriggerProps = {
  children: ReactNode;
};
export function CollapsiblePanelMobileButtonTrigger({
  children,
}: CollapsiblePanelMobileButtonTriggerProps) {
  const { togglePanel } = useCollapsiblePanelMobile();

  return (
    <button
      onClick={togglePanel}
      className="cursor-pointer w-full flex flex-row items-center gap-2 py-4 text-sm"
    >
      {children}
    </button>
  );
}

type CollapsiblePanelMobileContentProps = {
  children: ReactNode;
};
export function CollapsiblePanelMobileContent({
  children,
}: CollapsiblePanelMobileContentProps) {
  const { isOpen } = useCollapsiblePanelMobile();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
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
  );
}

type CollapsiblePanelMobileProps = {
  children: ReactNode;
  className?: string;
};
export function CollapsiblePanelMobileRoot({
  children,
  className,
}: CollapsiblePanelMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn("bg-neutral-950 border-t border-neutral-800", className)}
    >
      <CollapsiblePanelMobileContext.Provider value={{ togglePanel, isOpen }}>
        {children}
      </CollapsiblePanelMobileContext.Provider>
    </div>
  );
}

export const CollapsiblePanelMobile = {
  Root: CollapsiblePanelMobileRoot,
  ButtonLayout: CollapsiblePanelMobileButtonLayout,
  ButtonTrigger: CollapsiblePanelMobileButtonTrigger,
  Content: CollapsiblePanelMobileContent,
};
