"use client";

import "@xyflow/react/dist/style.css";

import { Panel, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

import { resolveCraftingTree } from "./resolve";

import CraftingTreeContent from "./CraftingTreeContent";
import DefaultlNode from "./Nodes/DefaultNode";
import { useSelectedMaterial } from "@/store/selected-material";
import DefaultEdge from "./Edges/DefaultEdge";

const nodeTypes = {
  node: DefaultlNode,
};
const edgeTypes = {
  edge: DefaultEdge,
};

type Props = {
  itemId: string;
};

export function CraftingTree(props: Props) {
  const anotherTree = resolveCraftingTree({ itemId: props.itemId });

  const clearMarkedMaterials = useSelectedMaterial(
    (state) => state.clearMarkedMaterials,
  );
  const handleClearMarkedMaterials = () => {
    clearMarkedMaterials(props.itemId);
  };

  const [nodes, , onNodesChange] = useNodesState(anotherTree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(anotherTree?.edges || []);

  return (
    <div className="w-full h-full bg-neutral-900 text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        draggable={false}
        fitView
        // @ts-expect-error - invalid types
        nodeTypes={nodeTypes}
        // @ts-expect-error - invalid types
        edgeTypes={edgeTypes}
      >
        <Panel position="top-right">
          <div className="">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary">Clear selection</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear marked materials?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to clear all marked materials? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearMarkedMaterials}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Panel>
        <CraftingTreeContent />
      </ReactFlow>
    </div>
  );
}
