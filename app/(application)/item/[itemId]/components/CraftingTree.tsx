"use client";

import { Panel } from "@xyflow/react";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";

import { ToggleLeftSidebar } from "./ToggleLeftSidebar";
import { ToggleRightSidebar } from "./ToggleRightSidebar";
import { ClearSelected } from "./ClearSelected";

type Props = {
  className?: string;
  itemId: string;
};

export function ItemCraftingTreeDesktop(props: Props) {
  const { itemId, className } = props;

  return (
    <CraftingTree itemId={itemId} className={className}>
      <ToggleLeftSidebar />
      <Panel position="top-center">
        <ClearSelected itemId={itemId} />
      </Panel>
      <ToggleRightSidebar />
    </CraftingTree>
  );
}

export function ItemCraftingTreeMobile(props: Props) {
  const { itemId, className } = props;

  return (
    <CraftingTree itemId={itemId} className={className}>
      <Panel position="top-right">
        <ClearSelected itemId={itemId} />
      </Panel>
    </CraftingTree>
  );
}
