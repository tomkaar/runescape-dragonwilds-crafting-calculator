"use client";

import { Panel } from "@xyflow/react";

import { CraftingTree } from "@/components/CraftingTree/CraftingTree";

import { ToggleLeftSidebar } from "./ToggleLeftSidebar";
import { ToggleRightSidebar } from "./ToggleRightSidebar";
import { ClearSelected } from "./ClearSelected";
import { Direction } from "./Direction";

type Props = {
  className?: string;
  itemId: string;
};

export function ItemCraftingTreeDesktop(props: Props) {
  const { itemId, className } = props;

  return (
    <CraftingTree itemId={itemId} className={className}>
      <ToggleLeftSidebar />
      <Panel position="top-center" className="flex flex-row gap-2">
        <ClearSelected itemId={itemId} />
        <Direction />
      </Panel>
      <ToggleRightSidebar />
    </CraftingTree>
  );
}

export function ItemCraftingTreeMobile(props: Props) {
  const { itemId, className } = props;

  return (
    <CraftingTree itemId={itemId} className={className}>
      <Panel position="top-right" className="flex flex-row gap-2">
        <ClearSelected itemId={itemId} />
        <Direction />
      </Panel>
    </CraftingTree>
  );
}
