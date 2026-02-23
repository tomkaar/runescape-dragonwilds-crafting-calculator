"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";

type CraftingTreeHoverContext = {
  enter: (nodeId: string) => void;
  reset: () => void;
  check: (nodeId: string) => boolean;
  isSet: boolean;
};

const Context = createContext<CraftingTreeHoverContext>({
  enter: () => {},
  reset: () => {},
  check: () => false,
  isSet: false,
});

export const useCraftingTreeHover = () => useContext(Context);

type Props = {
  children: ReactNode;
};

export function CraftingTreeHoverProvider({ children }: Props): ReactElement {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const enter = (nodeId: string) => {
    setHoveredNodeId(nodeId);
  };

  const reset = () => {
    setHoveredNodeId(null);
  };

  const check = (nodeId: string) => {
    if (!hoveredNodeId) return false;
    return nodeId.startsWith(hoveredNodeId);
  };

  return (
    <Context.Provider
      value={{ enter, reset, check, isSet: hoveredNodeId !== null }}
    >
      {children}
    </Context.Provider>
  );
}
