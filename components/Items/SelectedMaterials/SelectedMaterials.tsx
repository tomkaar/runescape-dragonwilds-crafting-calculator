"use client";

import { useSelectedMaterial } from "@/store/selected-material";

import { buildTreeFromNodeIds } from "./buildTreeFromNodeIds";
import { RenderBuildTree } from "./RenderBuildTree";
import { ListTodoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { Button } from "@/components/ui/button";
import {
  CollapsiblePanelDesktop,
  CollapsiblePanelMobile,
} from "@/components/ui/collapsible-panel";

type Props = {
  itemId: string;
  variant?: "desktop" | "mobile";
};

export function SelectedMaterial(props: Props) {
  const { itemId, variant = "desktop" } = props;

  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;
  const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);

  const markAsDone = useSelectedMaterial((state) => state.markAsDoneByNodeId);
  const handleSetAsDone = (id: string) => {
    markAsDone(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = (i[props.itemId] || []).filter(
    (item) => item.state === "TODO",
  );

  const tree = buildTreeFromNodeIds(selectedMaterials);

  const title = "Todo's";

  const actions = (
    <Input
      id="input-multiplier"
      type="number"
      autoComplete="off"
      min={1}
      max={1000}
      className="max-w-32"
      value={multiplier}
      onChange={(e) => setMultiplier(itemId, parseInt(e.target.value))}
    />
  );

  const content = (
    <div className="px-2">
      {multiplier > 1 ? (
        <div className="flex flex-row gap-2 items-center mt-2 px-4 py-1 bg-blue-950/75 rounded-lg w-full">
          <div className="grow flex flex-col">
            <span className="text-sm text-neutral-200">
              Add materials are currently multiplied by{" "}
              <span className="font-semibold">{multiplier}x</span>.
            </span>
          </div>
          <Button variant="ghost" onClick={() => setMultiplier(itemId, 1)}>
            Clear
          </Button>
        </div>
      ) : null}
      {tree.length === 0 ? (
        <div className="py-2 max-w-10/12">
          <span className="text-sm text-neutral-200">
            No selected materials to show, click on a material in the crafting
            tree or in the list to add materials.
          </span>
        </div>
      ) : null}
      {multiplier > 0 ? (
        <div className="mt-2">
          <RenderBuildTree
            tree={tree}
            handleSetAsDone={handleSetAsDone}
            multiplier={multiplier}
          />
        </div>
      ) : null}
    </div>
  );

  const PanelComponent =
    variant === "mobile" ? CollapsiblePanelMobile : CollapsiblePanelDesktop;

  return (
    <PanelComponent
      id="todo-materials"
      title={title}
      icon={ListTodoIcon}
      actions={actions}
    >
      {content}
    </PanelComponent>
  );
}
