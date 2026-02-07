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
import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTypes = {
  node: DefaultlNode,
};
const edgeTypes = {
  edge: DefaultEdge,
};

type Props = {
  itemId: string;
  sidebarIsCollapsed?: boolean;
  rightSidebarIsCollapsed?: boolean;
  toggleSidebar?: () => void;
  toggleRightSidebar?: () => void;
  className?: string;
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
    <div
      className={cn("w-full h-full bg-neutral-900 text-black", props.className)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        draggable={false}
        maxZoom={1.75}
        fitView
        // @ts-expect-error - invalid types
        nodeTypes={nodeTypes}
        // @ts-expect-error - invalid types
        edgeTypes={edgeTypes}
      >
        {props.sidebarIsCollapsed !== undefined && props.toggleSidebar && (
          <Panel position="top-left">
            <Button onClick={props.toggleSidebar} variant="secondary">
              {props.sidebarIsCollapsed ? (
                <PanelLeftOpenIcon className="w-2 h-2" />
              ) : (
                <PanelLeftCloseIcon className="w-2 h-2" />
              )}
            </Button>
          </Panel>
        )}

        <Panel position="top-center">
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

        {props.rightSidebarIsCollapsed !== undefined &&
          props.toggleRightSidebar && (
            <Panel position="top-right">
              <Button onClick={props.toggleRightSidebar} variant="secondary">
                {props.rightSidebarIsCollapsed ? (
                  <PanelRightOpenIcon className="w-2 h-2" />
                ) : (
                  <PanelRightCloseIcon className="w-2 h-2" />
                )}
              </Button>
            </Panel>
          )}

        <CraftingTreeContent />
      </ReactFlow>
    </div>
  );
}
