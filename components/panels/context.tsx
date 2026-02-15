"use client";

import {
  createContext,
  useEffect,
  useRef,
  type ReactNode,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  PANEL_LAYOUT_PAGE,
  PANEL_LAYOUT_SIDEBAR,
  PANEL_LAYOUT_SIDEBAR_RIGHT,
} from "@/constants/panel-layout";
import { useGroupCallbackRef, usePanelRef } from "react-resizable-panels";
import { readStoredLayout } from "@/utils/read-stored-layout";

type GroupRefCallback = ReturnType<typeof useGroupCallbackRef>[1];

type ContentContext = {
  sidebarIsCollapsed: boolean;
  rightSidebarIsCollapsed: boolean;
  setSidebarIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setRightSidebarIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarPanelRef: ReturnType<typeof usePanelRef>;
  toggleSidebar: () => void;
  sidebarRightPanelRef: ReturnType<typeof usePanelRef>;
  toggleRightSidebar: () => void;
  pageGroupRef: GroupRefCallback;
  sidebarGroupRef: GroupRefCallback;
  rightSidebarGroupRef: GroupRefCallback;
  isLayoutLoading: boolean;
};

function subscribe() {
  return () => {};
}

const Context = createContext<ContentContext>({
  sidebarIsCollapsed: false,
  rightSidebarIsCollapsed: false,
  setSidebarIsCollapsed: () => {},
  setRightSidebarIsCollapsed: () => {},
  sidebarPanelRef: { current: null },
  toggleSidebar: () => {},
  sidebarRightPanelRef: { current: null },
  toggleRightSidebar: () => {},
  pageGroupRef: () => {},
  sidebarGroupRef: () => {},
  rightSidebarGroupRef: () => {},
  isLayoutLoading: true,
});

export const useContentContext = () => useContext(Context);

type Props = {
  children: ReactNode;
};

export function ContentContextProvider({ children }: Props) {
  const sidebarPanelRef = usePanelRef();
  const sidebarRightPanelRef = usePanelRef();

  const [pageGroup, pageGroupRef] = useGroupCallbackRef();
  const [sidebarGroup, sidebarGroupRef] = useGroupCallbackRef();
  const [rightSidebarGroup, rightSidebarGroupRef] = useGroupCallbackRef();

  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [hasAppliedLayout, setHasAppliedLayout] = useState(false);

  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(false);
  const [rightSidebarIsCollapsed, setRightSidebarIsCollapsed] = useState(false);

  const isLayoutLoading =
    !isHydrated ||
    pageGroup === null ||
    sidebarGroup === null ||
    rightSidebarGroup === null;

  useEffect(() => {
    if (isLayoutLoading || hasAppliedLayout) {
      return;
    }

    const pageLayout = readStoredLayout(PANEL_LAYOUT_PAGE);
    const sidebarLayout = readStoredLayout(PANEL_LAYOUT_SIDEBAR);
    const sidebarRightLayout = readStoredLayout(PANEL_LAYOUT_SIDEBAR_RIGHT);

    if (pageLayout) {
      pageGroup.setLayout(pageLayout);
    }
    if (sidebarLayout) {
      sidebarGroup.setLayout(sidebarLayout);
    }
    if (sidebarRightLayout) {
      rightSidebarGroup.setLayout(sidebarRightLayout);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasAppliedLayout(true);
  }, [
    isLayoutLoading,
    pageGroup,
    sidebarGroup,
    rightSidebarGroup,
    hasAppliedLayout,
  ]);

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
        pageGroupRef,
        sidebarGroupRef,
        rightSidebarGroupRef,
        isLayoutLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
