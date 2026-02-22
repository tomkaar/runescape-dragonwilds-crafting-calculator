import { useContentContext } from "@/components/panels/context";
import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";

export function ToggleRightSidebar() {
  const { rightSidebarIsCollapsed, toggleRightSidebar } = useContentContext();

  return (
    <Panel position="top-right">
      <Button
        onClick={toggleRightSidebar}
        variant="secondary"
        className="cursor-pointer"
      >
        {rightSidebarIsCollapsed ? (
          <PanelRightOpenIcon className="w-2 h-2" />
        ) : (
          <PanelRightCloseIcon className="w-2 h-2" />
        )}
      </Button>
    </Panel>
  );
}
