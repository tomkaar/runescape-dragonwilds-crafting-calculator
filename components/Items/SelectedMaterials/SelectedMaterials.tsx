"use client";

import { useSelectedMaterial } from "@/store/selected-material";

import { buildTreeFromNodeIds } from "./buildTreeFromNodeIds";
import { RenderBuildTree } from "./RenderBuildTree";
import { Panel, usePanelRef } from "react-resizable-panels";
import { useRef, useState } from "react";
import { ListTodoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  itemId: string;
};

export function SelectedMaterial(props: Props) {
  const { itemId } = props;
  const panelRef = usePanelRef();
  const contentRef = useRef<HTMLDivElement>(null);

  const [multiplier, setMultiplier] = useState(1);

  const markAsDone = useSelectedMaterial((state) => state.markAsDoneByNodeId);
  const handleSetAsDone = (id: string) => {
    markAsDone(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = (i[props.itemId] || []).filter(
    (item) => item.state === "TODO",
  );

  const tree = buildTreeFromNodeIds(selectedMaterials);

  const togglePanel = () => {
    if (panelRef.current) {
      if (panelRef.current.isCollapsed()) {
        panelRef.current.expand();
        const contentHeight = contentRef.current?.offsetHeight;
        panelRef.current.expand();
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
      id="todo-materials"
      panelRef={panelRef}
      minSize={52}
      collapsible
      collapsedSize={52}
      className="bg-neutral-950 rounded-lg"
    >
      <div className="flex flex-row gap-2 px-4 py-2">
        <button
          onClick={togglePanel}
          className="cursor-pointer w-full flex flex-row items-center gap-2 text-sm"
        >
          <ListTodoIcon className="w-4 h-4 text-neutral-600" />
          Todo&apos;s
        </button>
        <Input
          id="input-multiplier"
          type="number"
          autoComplete="off"
          min={1}
          max={1000}
          className="max-w-32"
          value={multiplier}
          onChange={(e) => setMultiplier(parseInt(e.target.value))}
        />
      </div>

      <div className="overflow-scroll h-full pb-15">
        <div ref={contentRef} className="flex flex-col gap-1 w-full">
          {tree.length === 0 ? (
            <div className="px-2 py-2 max-w-10/12">
              <span className="text-sm text-neutral-200">
                No selected materials to show, click on a material in the
                crafting tree or in the list to add materials.
              </span>
            </div>
          ) : null}
          {multiplier > 0 ? (
            <RenderBuildTree
              tree={tree}
              handleSetAsDone={handleSetAsDone}
              multiplier={multiplier}
            />
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
