"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { usePanelRef } from "react-resizable-panels";

type ContentContext = {
  sidebarIsCollapsed: boolean;
  rightSidebarIsCollapsed: boolean;
  setSidebarIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setRightSidebarIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarPanelRef: ReturnType<typeof usePanelRef>;
  toggleSidebar: () => void;
  sidebarRightPanelRef: ReturnType<typeof usePanelRef>;
  toggleRightSidebar: () => void;
};

const Context = createContext<ContentContext>({
  sidebarIsCollapsed: false,
  rightSidebarIsCollapsed: false,
  setSidebarIsCollapsed: () => {},
  setRightSidebarIsCollapsed: () => {},
  sidebarPanelRef: { current: null },
  toggleSidebar: () => {},
  sidebarRightPanelRef: { current: null },
  toggleRightSidebar: () => {},
});

export const useContentContext = () => useContext(Context);

type Props = {
  children: ReactNode;
};

export function ContentContextProvider({ children }: Props) {
  const sidebarPanelRef = usePanelRef();
  const sidebarRightPanelRef = usePanelRef();

  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(false);
  const [rightSidebarIsCollapsed, setRightSidebarIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (sidebarPanelRef.current) {
      if (sidebarPanelRef.current.isCollapsed()) {
        sidebarPanelRef.current.expand();
      } else {
        sidebarPanelRef.current.collapse();
      }
    }
  };

  const toggleRightSidebar = () => {
    if (sidebarRightPanelRef.current) {
      if (sidebarRightPanelRef.current.isCollapsed()) {
        sidebarRightPanelRef.current.expand();
      } else {
        sidebarRightPanelRef.current.collapse();
      }
    }
  };

  return (
    <Context.Provider
      value={{
        sidebarIsCollapsed,
        rightSidebarIsCollapsed,
        setSidebarIsCollapsed,
        setRightSidebarIsCollapsed,
        sidebarPanelRef,
        sidebarRightPanelRef,
        toggleSidebar,
        toggleRightSidebar,
      }}
    >
      {children}
    </Context.Provider>
  );
}
